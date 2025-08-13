import { differenceInHours, formatDate } from "date-fns";
import { IRefundRepository } from "../../../../domain/repositories/refund.repository";
import { IRescheduleRequestRepository } from "../../../../domain/repositories/reschedule.request.repository";
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { isSessionExpired } from "../../../../infrastructure/utils/isSessionExpired";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { ISessionUserDTO, mapToUserSessionDTO } from "../../../dtos/session.dto";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { INotifyUserUseCase } from "../../../interfaces/notification/notification.usecase";
import { ICancelSessionRefundUseCase } from "../../../interfaces/refund";
import { ICancelSessionUseCase } from "../../../interfaces/session";

export class CancelSessionUseCase implements ICancelSessionUseCase {
	constructor(
		private sessionRepository: ISessionRepository,
		private rescheduleRequestRepo: IRescheduleRequestRepository,
		private notifyUserUseCase: INotifyUserUseCase,
		private userCancelSessionRefundUseCase: ICancelSessionRefundUseCase // inject refund use case
	) {}

	async execute(sessionId: string, userId: string): Promise<ISessionUserDTO> {
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// Check if cancel is allowed (24 hours before the session starts)
		const sessionDateOnly = new Date(session.date);
		const [hours, minutes] = session.startTime.split(":").map(Number);
		sessionDateOnly.setHours(hours, minutes, 0, 0);

		const cancelCutOff = new Date(sessionDateOnly.getTime() - 24 * 60 * 60 * 1000);
		if (cancelCutOff < new Date()) {
			throw new Error("You can only cancel at least 24 hours before the session starts");
		}

		const participant = session.findParticipant(userId);
		if (!participant) throw new Error("Unauthorized: User is not a participant in this session");

		if (![SessionStatusEnum.UPCOMING, SessionStatusEnum.APPROVED].includes(session.status)) {
			throw new Error("Only upcoming or approved sessions can be canceled");
		}

		if (isSessionExpired(session.date, session.startTime)) {
			throw new Error("Cannot cancel an expired session");
		}

		// --- Cancel related reschedule request ---
		const requestEntity = await this.rescheduleRequestRepo.findBySessionId(sessionId);
		if (requestEntity) {
			requestEntity.cancel(userId);
			await this.rescheduleRequestRepo.update(requestEntity);
		}

		// --- If paid session & payment complete → call refund use case ---
		if (session.pricing === "paid" && participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) {
			await this.userCancelSessionRefundUseCase.execute(sessionId, userId);
		}

		const updatedSession = await this.sessionRepository.updateStatus(sessionId, SessionStatusEnum.CANCELED);
		if (!updatedSession) throw new Error("Failed to cancel session");

		// Notify mentor about cancellation
		await this.notifyUserUseCase.execute({
			title: "📅 Session Canceled",
			message: `A participant has canceled the ${session.topic} session on ${formatDate(session.date, "dd-MM-yyyy")}.`,
			isRead: false,
			recipientId: session.mentor.id,
			type: NotificationTypeEnum.ERROR,
			link: "/mentor/sessions",
		});

		return requestEntity ? mapToUserSessionDTO(updatedSession, userId, requestEntity) : mapToUserSessionDTO(updatedSession, userId);
	}
}

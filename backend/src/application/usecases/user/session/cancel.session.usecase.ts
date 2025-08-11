import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { isSessionExpired } from "../../../../infrastructure/utils/isSessionExpired";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { ISessionUserDTO, mapToUserSessionDTO } from "../../../dtos/session.dto";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { ICancelSessionUseCase } from "../../../interfaces/session";
import { INotifyUserUseCase } from "../../../interfaces/notification/notification.usecase";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { IRescheduleRequestRepository } from "../../../../domain/repositories/reschedule.request.repository";

export class CancelSessionUseCase implements ICancelSessionUseCase {
	constructor(private sessionRepository: ISessionRepository, private rescheduleRequestRepo: IRescheduleRequestRepository, private notifyUserUseCase: INotifyUserUseCase) {}

	async execute(sessionId: string, userId: string): Promise<ISessionUserDTO> {
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		const participant = session.participants.find((p) => p.user.id === userId);
		if (!participant) throw new Error("Unauthorized: User is not a participant in this session");

		if (session.status !== SessionStatusEnum.UPCOMING && session.status !== SessionStatusEnum.APPROVED) {
			throw new Error("Only upcoming or approved sessions can be canceled");
		}

		if (isSessionExpired(session.date, session.startTime)) {
			throw new Error("Cannot cancel an expired session");
		}

		if (session.toObject().pricing === "paid" && participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) {
			throw new Error("Cannot cancel session that has already been paid");
		}

		const requestEntity = await this.rescheduleRequestRepo.findBySessionId(sessionId);
		if (requestEntity) {
			requestEntity.cancel(userId);
			await this.rescheduleRequestRepo.update(requestEntity);
		}

		const updatedSession = await this.sessionRepository.updateStatus(sessionId, SessionStatusEnum.CANCELED);
		if (!updatedSession) throw new Error("Failed to cancel session");

		await this.notifyUserUseCase.execute({
			title: "📅 Session Canceled",
			message: `A participant has canceled the session scheduled on ${session.date} at ${session.startTime} to ${session.endTime}.`,
			isRead: false,
			recipientId: session.mentor.id,
			type: NotificationTypeEnum.ERROR,
			link: "/mentor/sessions",
		});

		return mapToUserSessionDTO(updatedSession, userId);
	}
}

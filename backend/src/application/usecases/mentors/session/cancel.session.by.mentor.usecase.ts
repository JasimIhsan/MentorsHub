import { formatDate } from "date-fns";
import { IRescheduleRequestRepository } from "../../../../domain/repositories/reschedule.request.repository";
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { isSessionExpired } from "../../../../infrastructure/utils/isSessionExpired";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { INotifyUserUseCase } from "../../../interfaces/usecases/notification/notification.usecase";
import { ICancelSessionRefundUseCase } from "../../../interfaces/usecases/refund";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { ISessionMentorDTO, mapToMentorSessionDTO } from "../../../dtos/session.dto";
import { ICancelSessionByMentorUseCase } from "../../../interfaces/usecases/session";

export class CancelSessionByMentorUseCase implements ICancelSessionByMentorUseCase {
	constructor(
		private readonly _sessionRepo: ISessionRepository, //
		private readonly _rescheduleRequestRepo: IRescheduleRequestRepository,
		private readonly _refundUseCase: ICancelSessionRefundUseCase,
		private readonly _notifyUserUseCase: INotifyUserUseCase,
	) {}

	async execute(sessionId: string, mentorId: string): Promise<ISessionMentorDTO> {
		const session = await this._sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		if (session.mentor.id !== mentorId) throw new Error(CommonStringMessage.UNAUTHORIZED);

		if (session.status === SessionStatusEnum.PENDING) throw new Error("You cannot cancel a pending session. Instead, you can reject it as a mentor.");
		if (session.status === SessionStatusEnum.REJECTED) throw new Error("You cannot cancel a rejected session.");
		if (session.status === SessionStatusEnum.EXPIRED) throw new Error("You cannot cancel an expired session.");
		if (session.status === SessionStatusEnum.COMPLETED) throw new Error("You cannot cancel a completed session.");

		// Check if cancel is allowed (24 hours before the session starts)
		const sessionDateOnly = new Date(session.date);
		const [hours, minutes] = session.startTime.split(":").map(Number);
		sessionDateOnly.setHours(hours, minutes, 0, 0);

		const cancelCutOff = new Date(sessionDateOnly.getTime() - 24 * 60 * 60 * 1000);
		if (cancelCutOff < new Date()) {
			throw new Error("You can only cancel at least 24 hours before the session starts");
		}

		if (isSessionExpired(session.date, session.startTime)) {
			throw new Error("Cannot cancel an expired session");
		}

		// --- Cancel related reschedule request ---
		const request = await this._rescheduleRequestRepo.findBySessionId(sessionId);
		if (request) {
			request.cancel(mentorId);
			await this._rescheduleRequestRepo.update(request);
		}

		const paidParticipants = session.paidParticipants;
		for (const p of paidParticipants) {
			await this._refundUseCase.execute(session.id, p.user.id);
		}

		const updatedSession = await this._sessionRepo.updateStatus(sessionId, SessionStatusEnum.CANCELED);
		if (!updatedSession) throw new Error("Failed to cancel session");

		for (const p of paidParticipants) {
			await this._notifyUserUseCase.execute({
				title: "📅 Session Canceled",
				message: `Mentor has canceled the ${session.topic} session on ${formatDate(session.date, "dd-MM-yyyy")}.`,
				isRead: false,
				recipientId: p.user.id,
				type: NotificationTypeEnum.ERROR,
				link: "/mentor/sessions",
			});
		}

		return request ? mapToMentorSessionDTO(updatedSession, request) : mapToMentorSessionDTO(updatedSession);
	}
}

import { SessionEntity } from "../../../../domain/entities/session.entity";
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { isSessionExpired } from "../../../../infrastructure/utils/isSessionExpired";
import { ICancelSessionUseCase } from "../../../interfaces/session";

export class CancelSessionUseCase implements ICancelSessionUseCase {
	constructor(private sessionRepository: ISessionRepository) {}

	async execute(sessionId: string, userId: string): Promise<SessionEntity> {
		// Fetch the session by ID
		const session = await this.sessionRepository.getSessionById(sessionId);
		if (!session) {
			throw new Error("Session not found");
		}

		// Validate user is a participant
		const participant = session.getParticipants().find((p) => p.userId === userId);
		if (!participant) {
			throw new Error("Unauthorized: User is not a participant in this session");
		}

		// Check if session can be canceled (only upcoming or approved)
		const sessionStatus = session.getStatus();
		if (sessionStatus !== "upcoming" && sessionStatus !== "approved") {
			throw new Error("Only upcoming or approved sessions can be canceled");
		}

		// Check if session is expired
		if (isSessionExpired(session.getDate(), session.getTime())) {
			throw new Error("Cannot cancel an expired session");
		}

		// For paid sessions, check payment status
		if (session.toObject().pricing === "paid" && participant.paymentStatus === "completed") {
			throw new Error("Cannot cancel session that has already been paid");
		}

		const updatedSession = await this.sessionRepository.updateSessionStatus(sessionId, "canceled");
		if (!updatedSession) {
			throw new Error("Failed to cancel session");
		}
		return updatedSession;
	}
}

import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { isSessionExpired } from "../../../../infrastructure/utils/isSessionExpired";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { ISessionUserDTO, mapToUserSessionDTO } from "../../../dtos/session.dto";
import { ICancelSessionUseCase } from "../../../interfaces/session";

export class CancelSessionUseCase implements ICancelSessionUseCase {
	constructor(private sessionRepository: ISessionRepository) {}

	async execute(sessionId: string, userId: string): Promise<ISessionUserDTO> {
		// Fetch the session by ID
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) {
			throw new Error(CommonStringMessage.SESSION_NOT_FOUND);
		}

		// Validate user is a participant
		const participant = session.participants.find((p) => p.user.id === userId);
		if (!participant) {
			throw new Error("Unauthorized: User is not a participant in this session");
		}

		// Check if session can be canceled (only upcoming or approved)
		const sessionStatus = session.status;
		if (sessionStatus !== "upcoming" && sessionStatus !== "approved") {
			throw new Error("Only upcoming or approved sessions can be canceled");
		}

		// Check if session is expired
		if (isSessionExpired(session.date, session.time)) {
			throw new Error("Cannot cancel an expired session");
		}

		// For paid sessions, check payment status
		if (session.toObject().pricing === "paid" && participant.paymentStatus === "completed") {
			throw new Error("Cannot cancel session that has already been paid");
		}

		const updatedSession = await this.sessionRepository.updateStatus(sessionId, "canceled");
		if (!updatedSession) {
			throw new Error("Failed to cancel session");
		}
		return mapToUserSessionDTO(updatedSession, userId);
	}
}

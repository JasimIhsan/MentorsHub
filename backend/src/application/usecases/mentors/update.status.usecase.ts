import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IUpdateUserTaskProgressUseCase } from "../../interfaces/gamification";
import { IUpdateSessionStatusUseCase } from "../../interfaces/session";
import { ActionType } from "../../dtos/gamification.dto";
import { SessionStatusEnum } from "../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../interfaces/enums/session.payment.status.enum";

export class UpdateSessionStatusUsecase implements IUpdateSessionStatusUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly updateUserProgress: IUpdateUserTaskProgressUseCase) {}

	async execute(sessionId: string, status: SessionStatusEnum, rejectReason?: string): Promise<void> {
		// Update session status
		const updatedSession = await this.sessionRepo.updateStatus(sessionId, status, rejectReason);

		// Only if session is marked completed → trigger XP logic
		if (status === SessionStatusEnum.COMPLETED) {
			const paidParticipants = updatedSession.participants.filter((p) => p.paymentStatus === SessionPaymentStatusEnum.COMPLETED);

			// Gamify each paid participant
			for (const participant of paidParticipants) {
				await this.updateUserProgress.execute(participant.user.id, ActionType.COMPLETE_SESSION);
			}
		}
	}
}

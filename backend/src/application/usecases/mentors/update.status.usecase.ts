import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ActionType } from "../../dtos/gamification.dto";
import { IUpdateUserTaskProgressUseCase } from "../../interfaces/gamification";
import { IUpdateSessionStatusUseCase } from "../../interfaces/session";

export class UpdateSessionStatusUsecase implements IUpdateSessionStatusUseCase {
	constructor(private sessionRepo: ISessionRepository, private updateUserProgress: IUpdateUserTaskProgressUseCase) {}

	async execute(sessionId: string, status: string, rejectReason?: string): Promise<void> {
		// 1. Update the session status
		const session = await this.sessionRepo.updateSessionStatus(sessionId, status, rejectReason);

		// 2. Get paid participants
		const participants = session.getPaidParticipants();

		// 3. Update gamification progress for each participant
		for (const participant of participants) {
			await this.updateUserProgress.execute(participant.userId, ActionType.COMPLETE_SESSION);
		}
	}
}

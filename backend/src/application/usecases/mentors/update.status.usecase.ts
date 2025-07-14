import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IUpdateUserTaskProgressUseCase } from "../../interfaces/gamification";
import { IUpdateSessionStatusUseCase } from "../../interfaces/session";
import { SessionStatusEnum } from "../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../interfaces/enums/session.payment.status.enum";
import { ActionTypeEnum } from "../../interfaces/enums/gamification.action.type.enum";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class UpdateSessionStatusUsecase implements IUpdateSessionStatusUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly updateUserProgress: IUpdateUserTaskProgressUseCase, private readonly userRepo: IUserRepository) {}

	async execute(sessionId: string, status: SessionStatusEnum, rejectReason?: string): Promise<void> {
		// Update session status
		const updatedSession = await this.sessionRepo.updateStatus(sessionId, status, rejectReason);

		// Only if session is marked completed → trigger XP logic
		if (status === SessionStatusEnum.COMPLETED) {
			const allParticipants = updatedSession.participants;
			const paidParticipants = updatedSession.participants.filter((p) => p.paymentStatus === SessionPaymentStatusEnum.COMPLETED);

			for (const participant of allParticipants) {
				const user = await this.userRepo.findUserById(participant.user.id);
				if(!user) continue;
				user?.updateUserDetails({ sessionCompleted: user.sessionCompleted + 1 });
				await this.userRepo.updateUser(user?.id!, user);
			}

			// Gamify each paid participant
			for (const participant of paidParticipants) {
				await this.updateUserProgress.execute(participant.user.id, ActionTypeEnum.COMPLETE_SESSION);
			}
		}
	}
}

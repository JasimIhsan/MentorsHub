import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IUpdateUserTaskProgressUseCase } from "../../interfaces/gamification";
import { IUpdateSessionStatusUseCase } from "../../interfaces/session";
import { SessionStatusEnum } from "../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../interfaces/enums/session.payment.status.enum";
import { ActionTypeEnum } from "../../interfaces/enums/gamification.action.type.enum";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { INotifyUserUseCase } from "../../interfaces/notification/notification.usecase";
import { SessionStatusNotificationMap } from "../../constants/session.notification.messages";
import { IGetAvailabilityUseCase } from "../../interfaces/mentors/mentors.interface";

export class UpdateSessionStatusUsecase implements IUpdateSessionStatusUseCase {
	constructor(
		private readonly sessionRepo: ISessionRepository, //
		private readonly updateUserProgress: IUpdateUserTaskProgressUseCase,
		private readonly userRepo: IUserRepository,
		private readonly notifyUserUseCase: INotifyUserUseCase,
		private readonly getAvailabilityUseCase: IGetAvailabilityUseCase,
	) {}

	async execute(sessionId: string, status: SessionStatusEnum, rejectReason?: string): Promise<void> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error("Session not found");

		// ✅ Check using existing availability logic
		if (status === SessionStatusEnum.APPROVED) {
			const availableSlots = await this.getAvailabilityUseCase.execute(session.mentor.id, session.date);
			if (!availableSlots.includes(session.time)) {
				throw new Error("Slot is already booked by another session");
			}
		}

		const updatedSession = await this.sessionRepo.updateStatus(sessionId, status, rejectReason);
		const allParticipants = updatedSession.participants;
		const paidParticipants = allParticipants.filter((p) => p.paymentStatus === SessionPaymentStatusEnum.COMPLETED);

		if (status === SessionStatusEnum.COMPLETED) {
			for (const p of paidParticipants) {
				const user = await this.userRepo.findUserById(p.user.id);
				if (!user) continue;

				user.updateUserDetails({ sessionCompleted: user.sessionCompleted + 1 });
				await this.userRepo.updateUser(user.id!, user);
				await this.updateUserProgress.execute(p.user.id, ActionTypeEnum.COMPLETE_SESSION);
			}
		}

		const { title, msg, type } = SessionStatusNotificationMap[status];

		for (const p of allParticipants) {
			await this.notifyUserUseCase.execute({
				recipientId: p.user.id,
				title,
				message: msg(updatedSession.topic),
				type,
				isRead: false,
				link: "/sessions",
			});
		}
	}
}

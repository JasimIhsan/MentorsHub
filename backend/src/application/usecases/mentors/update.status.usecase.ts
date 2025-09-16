import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IUpdateUserTaskProgressUseCase } from "../../interfaces/usecases/gamification";
import { IReleaseSessionFundsUseCase, IUpdateSessionStatusUseCase } from "../../interfaces/usecases/session";
import { SessionStatusEnum } from "../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../interfaces/enums/session.payment.status.enum";
import { ActionTypeEnum } from "../../interfaces/enums/gamification.action.type.enum";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { INotifyUserUseCase } from "../../interfaces/usecases/notification/notification.usecase";
import { SessionStatusNotificationMap } from "../../constants/session.notification.messages";
import { IGetAvailabilityUseCase } from "../../interfaces/usecases/mentors/mentors.interface";

export class UpdateSessionStatusUsecase implements IUpdateSessionStatusUseCase {
	constructor(
		private readonly sessionRepo: ISessionRepository, //
		private readonly updateUserProgress: IUpdateUserTaskProgressUseCase,
		private readonly userRepo: IUserRepository,
		private readonly notifyUserUseCase: INotifyUserUseCase,
		private readonly getAvailabilityUseCase: IGetAvailabilityUseCase,
		private readonly releaseSessionFundsUseCase: IReleaseSessionFundsUseCase,
	) {}

	async execute(sessionId: string, status: SessionStatusEnum, rejectReason?: string): Promise<void> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error("Session not found");

		// Calculate endTime if not available
		const endTime = session.endTime || this.calculateEndTime(session.startTime, session.hours);

		// Check availability only for APPROVAL
		if (status === SessionStatusEnum.APPROVED) {
			const availableSlots = await this.getAvailabilityUseCase.execute(session.mentor.id, session.date, session.hours);
			if (!availableSlots.includes(session.startTime)) {
				throw new Error("Slot is already booked by another session");
			}
		}

		// Update status for main session
		const updatedSession = await this.sessionRepo.updateStatus(sessionId, status, rejectReason);
		const allParticipants = updatedSession.participants;
		const paidParticipants = allParticipants.filter((p) => p.paymentStatus === SessionPaymentStatusEnum.COMPLETED);

		// Handle COMPLETED sessions (fund release + gamification)
		if (status === SessionStatusEnum.COMPLETED) {
			for (const p of paidParticipants) {
				const user = await this.userRepo.findUserById(p.user.id);
				if (!user) continue;

				user.updateUserDetails({ sessionCompleted: user.sessionCompleted + 1 });
				await this.userRepo.updateUser(user.id!, user);
				await this.updateUserProgress.execute(p.user.id, ActionTypeEnum.COMPLETE_SESSION);
			}
			await this.releaseSessionFundsUseCase.execute(sessionId);
		}

		// Auto reject overlapping sessions when APPROVED
		if (status === SessionStatusEnum.APPROVED) {
			const overlappingSessions = await this.sessionRepo.findOverlappingSessions(session.mentor.id, session.date, session.startTime, endTime, sessionId);
			console.log("overlappingSessions: ", overlappingSessions);

			for (const s of overlappingSessions) {
				await this.sessionRepo.updateStatus(s.id, SessionStatusEnum.REJECTED, "Slot already booked");

				// Notify each rejected session participant
				const { title, msg, type } = SessionStatusNotificationMap[SessionStatusEnum.REJECTED];
				for (const p of s.participants) {
					await this.notifyUserUseCase.execute({
						recipientId: p.user.id,
						title,
						message: msg(s.topic),
						type,
						isRead: false,
						link: "/sessions",
					});
				}
			}
		}

		// Notify main session participants about the final status
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

	// Helper to calculate endTime if not present
	private calculateEndTime(startTime: string, hours: number): string {
		const [h, m] = startTime.split(":").map(Number);
		const endHour = h + hours;
		return `${endHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
	}
}

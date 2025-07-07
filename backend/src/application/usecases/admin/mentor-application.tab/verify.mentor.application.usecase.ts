import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IVerifyMentorApplicationUsecase } from "../../../interfaces/admin/admin.mentor.application.interface";
import { ICreateNotificationUseCase } from "../../../interfaces/notification";
import { Server } from "socket.io";
import { findUserSocket } from "../../../../infrastructure/socket/socket.io";
import { RoleEnum } from "../../../interfaces/enums/role";

export class VerifyMentorApplicationUseCase implements IVerifyMentorApplicationUsecase {
	constructor(
		private mentorRepo: IMentorProfileRepository,
		private userRepo: IUserRepository,
		private createNotificationUseCase: ICreateNotificationUseCase,
		private io?: Server, // Optional io
	) {}

	async execute(userId: string, status: "approved" | "rejected", reason?: string): Promise<UserEntity> {
		const user = await this.userRepo.findUserById(userId);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		const profile = await this.mentorRepo.findByUserId(userId);
		if (!profile) throw new Error("Mentor profile not found");

		if (status === "approved") {
			user.updateUserDetails({ role: RoleEnum.MENTOR, mentorRequestStatus: status });
		} else if (status === "rejected") {
			user.updateUserDetails({ mentorRequestStatus: status });
		}

		const notificationTitle = `Mentor Application ${status.charAt(0).toUpperCase() + status.slice(1)}`;
		const notificationMessage = status === "approved" ? "Congratulations! Your mentor application has been approved." : `Your mentor application has been rejected. ${reason ? `Reason: ${reason}` : ""}`;

		const notification = await this.createNotificationUseCase.execute(userId, notificationTitle, notificationMessage, status === "approved" ? "success" : "info");
		console.log("notification:", JSON.stringify(notification, null, 2));

		if (this.io) {
			const recipientSocketId = findUserSocket(userId);
			if (recipientSocketId) {
				this.io.to(recipientSocketId).emit("receive-notification", {
					_id: notification.id,
					userId,
					title: notificationTitle,
					message: notificationMessage,
					type: status === "approved" ? "success" : "error",
					read: false,
					createdAt: notification.createdAt || new Date(),
				});
				console.log(`Notification emitted to user ${userId} at socket ${recipientSocketId}`);
			} else {
				console.log(`User ${userId} offline. Notification saved to database.`);
			}
		} else {
			console.warn("Socket.IO instance not initialized. Notification saved to database.");
		}

		return await this.userRepo.updateUser(userId, user);
	}
}

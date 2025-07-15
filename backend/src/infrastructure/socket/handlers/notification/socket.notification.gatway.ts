import { INotificationGateway, NotificationPayload } from "../../../../application/interfaces/notification/notification.gatway";
import { NotificationEntity } from "../../../../domain/entities/notification.entity";
import { onlineUsers } from "../../context";

export class SocketNotificationGateway implements INotificationGateway {
	async notifyUser(userId: string, notificationEntity: NotificationEntity): Promise<void> {
		const userSocket = onlineUsers.get(userId);
		const payload: NotificationPayload = {
			recipientId: notificationEntity.recipientId,
			title: notificationEntity.title,
			message: notificationEntity.message,
			time: notificationEntity.createdAt,
			type: notificationEntity.type,
			isRead: notificationEntity.isRead,
			link: notificationEntity.link || "",
		};
		if (userSocket) {
			userSocket.emit("notify-user", payload);
			console.log(`🔔 Sent to ${userId}`);
		} else {
			console.log(`⚠️ User ${userId} offline – store in DB or skip.`);
		}
	}
}

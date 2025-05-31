import { INotificationEntity, NotificationEntity, NotificationType } from "../../../domain/entities/notification.entity";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { NotificationModel } from "../models/notification/notification.model";
import { INotificationDocument } from "../models/notification/notification.model";

export class NotificationRepositoryImpl implements INotificationRepository {
	async createNotification(userId: string, title: string, message: string, type: NotificationType): Promise<INotificationEntity> {
		const notification: INotificationDocument = await NotificationModel.create({
			recipientId: userId,
			title,
			message,
			type,
		});

		return new NotificationEntity({
			id: notification._id.toString(),
			recipientId: notification.recipientId.toString(),
			title: notification.title,
			message: notification.message,
			type: notification.type,
			link: notification.link,
			isRead: notification.isRead,
			createdAt: notification.createdAt,
		}).toObject();
	}

	async getUserNotifications(userId: string): Promise<INotificationEntity[]> {
		const notifications: INotificationDocument[] = await NotificationModel.find({
			recipientId: userId,
		}).sort({ createdAt: -1 });

		return notifications.map((n) =>
			new NotificationEntity({
				id: n._id.toString(),
				recipientId: n.recipientId.toString(),
				title: n.title,
				message: n.message,
				type: n.type,
				link: n.link,
				isRead: n.isRead,
				createdAt: n.createdAt,
			}).toObject()
		);
	}

	async markAsRead(notificationId: string): Promise<void> {
		await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true });
	}

	async markAllAsRead(userId: string): Promise<void> {
		await NotificationModel.updateMany({ recipientId: userId, isRead: false }, { isRead: true });
	}
}

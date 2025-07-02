import { INotificationEntity, NotificationEntity, NotificationType } from "../../../domain/entities/notification.entity";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { NotificationModel } from "../models/notification/notification.model";
import { INotificationDocument } from "../models/notification/notification.model";

export class NotificationRepositoryImpl implements INotificationRepository {
	async createNotification(userId: string, title: string, message: string, type: NotificationType): Promise<INotificationEntity> {
		try {
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
		} catch (error) {
			return handleExceptionError(error, "Error creating notification");
		}
	}

	async getUserNotifications(params: { userId: string; page: number; limit: number; isRead?: boolean; search?: string }): Promise<INotificationEntity[]> {
		try {
			const { userId, page, limit, isRead, search } = params;

			const query: any = { recipientId: userId };

			if (isRead !== undefined) query.isRead = isRead;

			if (search) {
				query.$or = [{ title: { $regex: search, $options: "i" } }, { message: { $regex: search, $options: "i" } }];
			}

			const notifications = await NotificationModel.find(query)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit);

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
				}).toObject(),
			);
		} catch (error) {
			return handleExceptionError(error, "Error fetching notifications");
		}
	}

	async countUserNotifications(params: { userId: string; isRead?: boolean; search?: string }): Promise<number> {
		try {
			const { userId, isRead, search } = params;

			const query: any = { recipientId: userId };

			if (isRead !== undefined) query.isRead = isRead;

			if (search) {
				query.$or = [{ title: { $regex: search, $options: "i" } }, { message: { $regex: search, $options: "i" } }];
			}

			return await NotificationModel.countDocuments(query);
		} catch (error) {
			return handleExceptionError(error, "Error counting notifications");
		}
	}

	async markAsRead(notificationId: string): Promise<void> {
		try {
			await NotificationModel.updateOne({ _id: notificationId }, { isRead: true });
		} catch (error) {
			return handleExceptionError(error, "Error marking notification as read");
		}
	}

	async markAllAsRead(userId: string): Promise<void> {
		try {
			await NotificationModel.updateMany({ recipientId: userId, isRead: false }, { isRead: true });
		} catch (error) {
			return handleExceptionError(error, "Error marking all notifications as read");
		}
	}
}

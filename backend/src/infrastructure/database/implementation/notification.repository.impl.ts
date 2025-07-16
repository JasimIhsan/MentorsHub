import { NotificationTypeEnum } from "../../../application/interfaces/enums/notification.type.enum";
import { NotificationEntity } from "../../../domain/entities/notification.entity";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { NotificationModel } from "../models/notification/notification.model";
import { INotificationDocument } from "../models/notification/notification.model";

export class NotificationRepositoryImpl implements INotificationRepository {
	async createNotification(userId: string, title: string, message: string, type: NotificationTypeEnum, link?: string): Promise<NotificationEntity> {
		try {
			const notification: INotificationDocument = await NotificationModel.create({
				recipientId: userId,
				title,
				message,
				type,
				link,
			});

			return NotificationEntity.fromDBDocument(notification);
		} catch (error) {
			return handleExceptionError(error, "Error creating notification");
		}
	}

	async getUserNotifications(params: { userId: string; isRead?: boolean; search?: string }): Promise<NotificationEntity[]> {
		try {
			const { userId, isRead, search } = params;

			const query: any = { recipientId: userId };

			if (isRead !== undefined) query.isRead = isRead;

			if (search) {
				query.$or = [{ title: { $regex: search, $options: "i" } }, { message: { $regex: search, $options: "i" } }];
			}

			const notifications = await NotificationModel.find(query).sort({ createdAt: -1 });
			// .skip((page - 1) * limit)
			// .limit(limit);

			return notifications.map(NotificationEntity.fromDBDocument);
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

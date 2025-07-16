import { NotificationType } from "aws-sdk/clients/budgets";
import { NotificationEntity, NotificationEntityProps } from "../entities/notification.entity";

export interface INotificationRepository {
	createNotification(userId: string, title: string, message: string, type: NotificationType, link?: string): Promise<NotificationEntity>;
	getUserNotifications(params: { userId: string; isRead?: boolean; search?: string }): Promise<NotificationEntity[]>;
	countUserNotifications(params: { userId: string; isRead?: boolean; search?: string }): Promise<number>;
	markAsRead(notificationId: string): Promise<void>;
	markAllAsRead(userId: string): Promise<void>;
}

import { NotificationType } from "aws-sdk/clients/budgets";
import { INotificationEntity } from "../entities/notification.entity";

export interface INotificationRepository {
	createNotification(userId: string, title: string, message: string, type: NotificationType): Promise<INotificationEntity>;
	getUserNotifications(params: { userId: string; page: number; limit: number; isRead?: boolean; search?: string }): Promise<INotificationEntity[]>;
	countUserNotifications(params: { userId: string; isRead?: boolean; search?: string }): Promise<number>;
	markAsRead(notificationId: string): Promise<void>;
	markAllAsRead(userId: string): Promise<void>;
}

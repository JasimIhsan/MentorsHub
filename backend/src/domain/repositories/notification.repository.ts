import { NotificationType } from "../../infrastructure/database/models/notification/notification.model";
import { INotificationEntity } from "../entities/notification.entity";

export interface INotificationRepository {
	createNotification(userId: string,title: string, message: string, type: NotificationType): Promise<INotificationEntity>;
	getUserNotifications(userId: string): Promise<INotificationEntity[]>;
	markAsRead(notificationId: string): Promise<void>;
	markAllAsRead(userId: string): Promise<void>;

}

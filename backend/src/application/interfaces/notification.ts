import { NotificationType } from "../../domain/entities/notification.entity";
import { INotificationEntity } from "../../domain/entities/notification.entity";

export interface ICreateNotificationUseCase {
	execute(userId: string, title: string, message: string, type: NotificationType): Promise<INotificationEntity>;
}

export interface IGetUserNotificationsUseCase {
	execute(userId: string): Promise<INotificationEntity[]>;
}

export interface IMarkAsReadUseCase {
	execute(notificationId: string): Promise<void>;
}

export interface IMarkAllAsReadUseCase {
	execute(userId: string): Promise<void>;
}

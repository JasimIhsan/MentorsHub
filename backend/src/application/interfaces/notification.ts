import { NotificationType } from "../../domain/entities/notification.entity";
import { INotificationEntity } from "../../domain/entities/notification.entity";

export interface ICreateNotificationUseCase {
	execute(userId: string, title: string, message: string, type: NotificationType): Promise<INotificationEntity>;
}

export interface IGetUserNotificationsUseCase {
	execute(params: { userId: string; page: number; limit: number; isRead?: boolean; search?: string }): Promise<{
		notifications: INotificationEntity[];
		total: number;
		currentPage: number;
		totalPages: number;
	}>;
}

export interface IMarkAsReadUseCase {
	execute(notificationId: string): Promise<void>;
}

export interface IMarkAllAsReadUseCase {
	execute(userId: string): Promise<void>;
}

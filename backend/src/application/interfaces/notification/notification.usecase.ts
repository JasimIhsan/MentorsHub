import { NotificationEntityProps } from "../../../domain/entities/notification.entity";
import { INotificationDTO } from "../../dtos/notification.dto";
import { NotificationTypeEnum } from "../enums/notification.type.enum";

export interface ICreateNotificationUseCase {
	execute(userId: string, title: string, message: string, type: NotificationTypeEnum): Promise<INotificationDTO>;
}

export interface IGetUserNotificationsUseCase {
	execute(params: { userId: string; page: number; limit: number; isRead?: boolean; search?: string }): Promise<{ notifications: INotificationDTO[]; total: number }>;
}

export interface IMarkAsReadUseCase {
	execute(notificationId: string): Promise<void>;
}

export interface IMarkAllAsReadUseCase {
	execute(userId: string): Promise<void>;
}

export interface INotifyUserUseCase {
	execute(payload: NotificationEntityProps): Promise<void>;
}

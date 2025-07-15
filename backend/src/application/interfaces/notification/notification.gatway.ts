import { NotificationEntity } from "../../../domain/entities/notification.entity";
import { NotificationTypeEnum } from "../enums/notification.type.enum";

export type NotificationPayload = {
	type: NotificationTypeEnum;
	recipientId: string;
	title: string;
	message: string;
	isRead: boolean;
	description?: string;
	time: Date;
	link: string;
};

export interface INotificationGateway {
	notifyUser(userId: string, payload: NotificationEntity): Promise<void>;
}

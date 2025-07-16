import { NotificationEntity } from "../../domain/entities/notification.entity";
import { NotificationTypeEnum } from "../interfaces/enums/notification.type.enum";

export interface INotificationDTO {
	id: string;
	recipientId: string;
	title: string;
	message: string;
	type: NotificationTypeEnum;
	link?: string;
	isRead: boolean;
	createdAt: Date;
}

export function mapToNotificationDTO(entity: NotificationEntity): INotificationDTO {
	return {
		id: entity.id!,
		recipientId: entity.recipientId,
		title: entity.title,
		message: entity.message,
		type: entity.type,
		link: entity.link,
		isRead: entity.isRead,
		createdAt: entity.createdAt,
	}
}


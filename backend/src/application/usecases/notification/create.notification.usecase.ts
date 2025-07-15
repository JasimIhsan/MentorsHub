import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { NotificationEntityProps } from "../../../domain/entities/notification.entity";
import { ICreateNotificationUseCase } from "../../interfaces/notification/notification.usecase";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
	constructor(private notificationRepo: INotificationRepository) {}

	async execute(userId: string, title: string, message: string, type: NotificationTypeEnum = NotificationTypeEnum.INFO): Promise<NotificationEntityProps> {
		const notification = await this.notificationRepo.createNotification(userId, title, message, type);
		return notification;
	}
}

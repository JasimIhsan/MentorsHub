import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { INotificationEntity, NotificationType } from "../../../domain/entities/notification.entity";
import { ICreateNotificationUseCase } from "../../interfaces/notification";
import { Server } from "socket.io";

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
	constructor(private notificationRepo: INotificationRepository) {}

	async execute(userId: string, title: string, message: string, type: NotificationType = "info"): Promise<INotificationEntity> {
		const notification = await this.notificationRepo.createNotification(userId, title, message, type);
		return notification;
	}
}

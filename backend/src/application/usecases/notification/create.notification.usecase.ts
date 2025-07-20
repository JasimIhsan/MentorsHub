import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { ICreateNotificationUseCase } from "../../interfaces/notification/notification.usecase";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";
import { INotificationDTO, mapToNotificationDTO } from "../../dtos/notification.dto";

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
	constructor(private notificationRepo: INotificationRepository) {}

	async execute(userId: string, title: string, message: string, type: NotificationTypeEnum = NotificationTypeEnum.INFO): Promise<INotificationDTO> {
		const notification = await this.notificationRepo.createNotification(userId, title, message, type);
		return mapToNotificationDTO(notification);
	}
}

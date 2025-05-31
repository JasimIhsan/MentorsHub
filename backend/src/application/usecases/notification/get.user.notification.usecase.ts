import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { INotificationEntity } from "../../../domain/entities/notification.entity";
import { IGetUserNotificationsUseCase } from "../../interfaces/notification";

export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase{
	constructor(private notificationRepo: INotificationRepository) {}

	async execute(userId: string): Promise<INotificationEntity[]> {
		return await this.notificationRepo.getUserNotifications(userId);
	}
}

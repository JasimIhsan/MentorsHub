import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IMarkAllAsReadUseCase } from "../../interfaces/notification";

export class MarkAllNotificationsAsReadUseCase implements IMarkAllAsReadUseCase {
	constructor(private notificationRepo: INotificationRepository) {}

	async execute(userId: string): Promise<void> {
		await this.notificationRepo.markAllAsRead(userId);
	}
}

import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IMarkAsReadUseCase } from "../../interfaces/notification/notification.usecase";

export class MarkNotificationAsReadUseCase implements IMarkAsReadUseCase {
	constructor(private notificationRepo: INotificationRepository) {}

	async execute(notificationId: string): Promise<void> {
		await this.notificationRepo.markAsRead(notificationId);
	}
}

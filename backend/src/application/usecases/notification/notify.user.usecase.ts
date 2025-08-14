import { NotificationEntityProps } from "../../../domain/entities/notification.entity";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { mapToNotificationDTO } from "../../dtos/notification.dto";
import { INotificationGateway } from "../../interfaces/usecases/notification/notification.gatway";
import { INotifyUserUseCase } from "../../interfaces/usecases/notification/notification.usecase";

export class NotifyUserUseCase implements INotifyUserUseCase {
	constructor(private readonly _notificationRepo: INotificationRepository, private readonly _notifyGateway: INotificationGateway) {}

	async execute(payload: NotificationEntityProps): Promise<void> {
		const notificationEntity = await this._notificationRepo.createNotification(payload.recipientId, payload.title, payload.message, payload.type);
		await this._notifyGateway.notifyUser(notificationEntity.recipientId, mapToNotificationDTO(notificationEntity));
	}
}

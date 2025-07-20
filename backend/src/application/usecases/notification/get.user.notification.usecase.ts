import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IGetUserNotificationsUseCase } from "../../interfaces/notification/notification.usecase";
import { INotificationDTO, mapToNotificationDTO } from "../../dtos/notification.dto";

// Interface for paginated response
interface PaginatedNotificationResponse {
	notifications: INotificationDTO[];
	total: number;
}

export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase {
	constructor(private notificationRepo: INotificationRepository) {}

	async execute(params: { userId: string; isRead?: boolean; search?: string }): Promise<PaginatedNotificationResponse> {
		const { userId, isRead, search } = params;

		// Fetch notifications and total count
		const [notifications, total] = await Promise.all([this.notificationRepo.getUserNotifications(params), this.notificationRepo.countUserNotifications({ userId, isRead, search })]);

		return {
			notifications: notifications.map(mapToNotificationDTO),
			total,
		};
	}
}

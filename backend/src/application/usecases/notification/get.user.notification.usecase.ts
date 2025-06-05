import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { INotificationEntity } from "../../../domain/entities/notification.entity";
import { IGetUserNotificationsUseCase } from "../../interfaces/notification";

// Interface for paginated response
interface PaginatedNotificationResponse {
	notifications: INotificationEntity[];
	total: number;
	currentPage: number;
	totalPages: number;
}

export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase {
	constructor(private notificationRepo: INotificationRepository) {}

	async execute(params: { userId: string; page: number; limit: number; isRead?: boolean; search?: string }): Promise<PaginatedNotificationResponse> {
		const { userId, page, limit, isRead, search } = params;

		// Fetch notifications and total count
		const [notifications, total] = await Promise.all([this.notificationRepo.getUserNotifications(params), this.notificationRepo.countUserNotifications({ userId, isRead, search })]);

		// Calculate total pages
		const totalPages = Math.ceil(total / limit);

		return {
			notifications,
			total,
			currentPage: page,
			totalPages,
		};
	}
}

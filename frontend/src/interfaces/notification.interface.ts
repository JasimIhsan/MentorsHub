export type NotificationType = "info" | "warning" | "success" | "error" | "reminder";

export interface INotification {
	id: string;
	recipientId: string;
	title: string;
	message: string;
	type: NotificationType;
	link?: string;
	isRead: boolean;
	createdAt: Date;
}

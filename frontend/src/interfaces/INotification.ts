export type NotificationType = "info" | "warning" | "success" | "error";

export interface INotification {
	recipientId: string;
	title: string;
	message: string;
	type: NotificationType;
	link?: string;
	isRead: boolean;
	createdAt: Date;
	id?: string;
}

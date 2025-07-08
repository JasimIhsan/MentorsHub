// domain/entities/notification.entity.ts

import { NotificationTypeEnum } from "../../application/interfaces/enums/notification.type.enum";

export interface INotificationEntity {
	recipientId: string;
	title: string;
	message: string;
	type?: NotificationTypeEnum;
	link?: string;
	isRead: boolean;
	createdAt?: Date;
	id?: string;
}

export class NotificationEntity {
	private _id?: string;
	private recipientId: string;
	private title: string;
	private message: string;
	private type: NotificationTypeEnum;
	private link?: string;
	private isRead: boolean;
	private createdAt: Date;

	constructor(data: INotificationEntity) {
		this._id = data.id;
		this.recipientId = data.recipientId;
		this.title = data.title;
		this.message = data.message;
		this.type = data.type ?? NotificationTypeEnum.INFO;
		this.link = data.link;
		this.isRead = data.isRead ?? false;
		this.createdAt = data.createdAt ?? new Date();
	}

	// --- GETTERS ---

	get id(): string | undefined {
		return this._id;
	}

	getRecipientId(): string {
		return this.recipientId;
	}

	getTitle(): string {
		return this.title;
	}

	getMessage(): string {
		return this.message;
	}

	getType(): NotificationTypeEnum {
		return this.type;
	}

	getLink(): string | undefined {
		return this.link;
	}

	getIsRead(): boolean {
		return this.isRead;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	// --- METHODS ---

	markAsRead() {
		this.isRead = true;
	}

	updateMessage(title: string, message: string) {
		this.title = title;
		this.message = message;
	}

	toObject(): INotificationEntity {
		return {
			id: this._id,
			recipientId: this.recipientId,
			title: this.title,
			message: this.message,
			type: this.type,
			link: this.link,
			isRead: this.isRead,
			createdAt: this.createdAt,
		};
	}
}

import { NotificationTypeEnum } from "../../application/interfaces/enums/notification.type.enum";
import { INotificationDocument } from "../../infrastructure/database/models/notification/notification.model";

export interface NotificationEntityProps {
	id?: string;
	recipientId: string;
	title: string;
	message: string;
	type: NotificationTypeEnum;
	link?: string;
	isRead: boolean;
	createdAt?: Date;
}

export class NotificationEntity {
	private _id?: string;
	private _recipientId: string;
	private _title: string;
	private _message: string;
	private _type: NotificationTypeEnum;
	private _link?: string;
	private _isRead: boolean;
	private _createdAt: Date;

	constructor(data: NotificationEntityProps) {
		this._id = data.id;
		this._recipientId = data.recipientId;
		this._title = data.title;
		this._message = data.message;
		this._type = data.type ?? NotificationTypeEnum.INFO;
		this._link = data.link;
		this._isRead = data.isRead ?? false;
		this._createdAt = data.createdAt ?? new Date();
	}

	// --- GETTERS ---

	get id(): string | undefined {
		return this._id;
	}

	get recipientId(): string {
		return this._recipientId;
	}

	get title(): string {
		return this._title;
	}

	get message(): string {
		return this._message;
	}

	get type(): NotificationTypeEnum {
		return this._type;
	}

	get link(): string | undefined {
		return this._link;
	}

	get isRead(): boolean {
		return this._isRead;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	// --- SETTERS ---

	set title(newTitle: string) {
		this._title = newTitle;
	}

	set message(newMessage: string) {
		this._message = newMessage;
	}

	set isRead(value: boolean) {
		this._isRead = value;
	}

	// --- METHODS ---

	markAsRead(): void {
		this._isRead = true;
	}

	updateMessage(title: string, message: string): void {
		this._title = title;
		this._message = message;
	}

	toObject() {
		return {
			id: this._id,
			recipientId: this._recipientId,
			title: this._title,
			message: this._message,
			type: this._type,
			link: this._link,
			isRead: this._isRead,
			createdAt: this._createdAt,
		};
	}

	static fromDBDocument(doc: INotificationDocument) {
		return new NotificationEntity({
			id: doc._id.toString(),
			recipientId: doc.recipientId.toString(),
			title: doc.title,
			message: doc.message,
			type: doc.type,
			link: doc.link,
			isRead: doc.isRead,
			createdAt: doc.createdAt,
		});
	}
}

// domain/entities/message.entity.ts

import { IMessage } from "../../infrastructure/database/models/text-message/message.model";

export type MessageType = "text" | "image" | "file";

export class MessageEntity {
	private readonly _id: string;
	private readonly _chatId: string;
	private readonly _sender: string;
	private _content: string;
	private readonly _type: MessageType;
	private _fileUrl?: string;
	private _readBy: string[];
	private readonly _createdAt: Date;
	private _updatedAt: Date;

	constructor(props: { id: string; chatId: string; sender: string; content: string; type: MessageType; fileUrl?: string; readBy: string[]; createdAt: Date; updatedAt: Date }) {
		this._id = props.id;
		this._chatId = props.chatId;
		this._sender = props.sender;
		this._content = props.content;
		this._type = props.type;
		this._fileUrl = props.fileUrl;
		this._readBy = props.readBy;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
	}

	// 🔓 Getters
	get id(): string {
		return this._id;
	}

	get chatId(): string {
		return this._chatId;
	}

	get sender(): string {
		return this._sender;
	}

	get content(): string {
		return this._content;
	}

	get type(): MessageType {
		return this._type;
	}

	get fileUrl(): string | undefined {
		return this._fileUrl;
	}

	get readBy(): string[] {
		return [...this._readBy];
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	// 🔧 Methods

	isReadBy(userId: string): boolean {
		return this._readBy.includes(userId);
	}

	markAsRead(userId: string): void {
		if (!this._readBy.includes(userId)) {
			this._readBy.push(userId);
			this.touch();
		}
	}

	isTextMessage(): boolean {
		return this._type === "text";
	}

	isImageMessage(): boolean {
		return this._type === "image";
	}

	isFileMessage(): boolean {
		return this._type === "file";
	}

	private touch(): void {
		this._updatedAt = new Date();
	}

	static mapToMessageEntity = (doc: IMessage): MessageEntity => {
		return new MessageEntity({
			id: doc._id?.toString() as string,
			chatId: doc.chatId.toString(),
			sender: doc.sender.toString(),
			content: doc.content,
			type: doc.type,
			fileUrl: doc.fileUrl,
			readBy: doc.readBy.map((id) => id.toString()),
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	};
}

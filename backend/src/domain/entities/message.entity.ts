import { IMessage } from "../../infrastructure/database/models/text-message/message.model";

export type MessageType = "text" | "image" | "file";

interface MessageEntityProps {
	id: string;
	chat: string;
	sender: string;
	content: string;
	type: MessageType;
	fileUrl?: string;
	readBy: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export class MessageEntity {
	private readonly _id: string;
	private readonly _chat: string;
	private readonly _sender: string;
	private readonly _content: string;
	private readonly _type: MessageType;
	private readonly _fileUrl?: string;
	private _readBy: string[];
	private readonly _createdAt: Date;
	private _updatedAt: Date;

	constructor(props: MessageEntityProps) {
		this._id = props.id;
		this._chat = props.chat;
		this._sender = props.sender;
		this._content = props.content;
		this._type = props.type;
		this._fileUrl = props.fileUrl;
		this._readBy = props.readBy;
		this._createdAt = props.createdAt ?? new Date();
		this._updatedAt = props.updatedAt ?? new Date();
	}

	// 🔓 Getters
	get id(): string {
		return this._id;
	}

	get chatId(): string {
		return this._chat;
	}

	get senderId(): string {
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

	// 📦 Factory mapper from DB (basic for now — replace sender/chat with actual entity loaders)
	static fromDBDocument(doc: IMessage): MessageEntity {
		return new MessageEntity({
			id: doc._id?.toString()!,
			chat: doc.chatId.toString(),
			sender: doc.sender.toString(),
			content: doc.content,
			type: doc.type,
			fileUrl: doc.fileUrl,
			readBy: doc.readBy.map((id) => id.toString()),
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

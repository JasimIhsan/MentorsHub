// domain/entities/chat.entity.ts

import { IChat } from "../../infrastructure/database/models/text-message/chat.model";

export class ChatEntity {
	private readonly _id: string;
	private _isGroupChat: boolean;
	private _name?: string;
	private _participants: string[];
	private _groupAdmin?: string;
	private _lastMessage?: string;
	private readonly _createdAt: Date;
	private _updatedAt: Date;

	constructor(props: { id: string; isGroupChat: boolean; name?: string; participants: string[]; groupAdmin?: string; lastMessage?: string; createdAt: Date; updatedAt: Date }) {
		this._id = props.id;
		this._isGroupChat = props.isGroupChat;
		this._name = props.name;
		this._participants = props.participants;
		this._groupAdmin = props.groupAdmin;
		this._lastMessage = props.lastMessage;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
}

	// 🔓 Getters
	get id(): string {
		return this._id;
	}

	get isGroupChat(): boolean {
		return this._isGroupChat;
	}

	get name(): string | undefined {
		return this._name;
	}

	get participants(): string[] {
		return [...this._participants]; // Return a copy
	}

	get groupAdmin(): string | undefined {
		return this._groupAdmin;
	}

	get lastMessage(): string | undefined {
		return this._lastMessage;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	// 🔧 Business Logic Methods

	isUserParticipant(userId: string): boolean {
		return this._participants.includes(userId);
	}

	addParticipant(userId: string): void {
		if (!this._participants.includes(userId)) {
			this._participants.push(userId);
			this.touch();
		}
	}

	removeParticipant(userId: string): void {
		this._participants = this._participants.filter((id) => id !== userId);
		if (this._groupAdmin === userId) this._groupAdmin = undefined; // reset admin if removed
		this.touch();
	}

	changeGroupName(newName: string): void {
		if (!this._isGroupChat) return;
		this._name = newName;
		this.touch();
	}

	setGroupAdmin(userId: string): void {
		if (!this._participants.includes(userId)) {
			throw new Error("User must be a participant to be set as group admin.");
		}
		this._groupAdmin = userId;
		this.touch();
	}

	updateLastMessage(messageId: string): void {
		this._lastMessage = messageId;
		this.touch();
	}

	private touch(): void {
		this._updatedAt = new Date();
	}

	static fromDbDocument = (doc: IChat): ChatEntity => {
		return new ChatEntity({
			id: doc._id?.toString() as string,
			isGroupChat: doc.isGroupChat,
			name: doc.name,
			participants: doc.participants.map((id) => id.toString()),
			groupAdmin: doc.groupAdmin?.toString(),
			lastMessage: doc.lastMessage?.toString(),
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	};
}

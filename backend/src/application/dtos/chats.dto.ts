import { MessageEntity } from "../../domain/entities/message.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { ChatEntity } from "../../domain/entities/chat.entity";

export interface IUserSummaryDTO {
	id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export interface IMessageSummaryDTO {
	id: string;
	content: string;
	type: string;
	sender: IUserSummaryDTO;
	createdAt: Date;
}

export interface IChatDTO {
	id: string;
	isGroupChat: boolean;
	name?: string;
	participants: IUserSummaryDTO[];
	groupAdmin?: IUserSummaryDTO;
	lastMessage?: IMessageSummaryDTO;
	createdAt: Date;
	updatedAt: Date;
}

export const mapToUserSummaryDTO = (user: UserEntity): IUserSummaryDTO => ({
	id: user.id!,
	firstName: user.firstName,
	lastName: user.lastName,
	avatar: user.avatar ?? undefined,
});

export const mapToMessageSummaryDTO = (message: MessageEntity, sender: UserEntity): IMessageSummaryDTO => ({
	id: message.id,
	content: message.content,
	type: message.type,
	sender: mapToUserSummaryDTO(sender),
	createdAt: message.createdAt,
});

export const mapToChatDTO = (chat: ChatEntity, users: UserEntity[], lastMessage?: MessageEntity, adminUser?: UserEntity): IChatDTO => {
	const userMap = new Map(users.map((u) => [u.id, u]));

	return {
		id: chat.id,
		isGroupChat: chat.isGroupChat,
		name: chat.name,
		participants: chat.participants.map((id) => mapToUserSummaryDTO(userMap.get(id)!)),
		groupAdmin: adminUser ? mapToUserSummaryDTO(adminUser) : undefined,
		lastMessage: lastMessage ? mapToMessageSummaryDTO(lastMessage, userMap.get(lastMessage.senderId)!) : undefined,
		createdAt: chat.createdAt,
		updatedAt: chat.updatedAt,
	};
};

import { IChat } from "../../infrastructure/database/models/text-message/chat.model";
import { IChatDTO } from "../../application/dtos/chats.dto";

export interface IChatRepository {
	createChat(participantIds: string[], isGroupChat: boolean, name?: string, groupAdmin?: string): Promise<IChat>;
	findChatById(chatId: string): Promise<IChat | null>;
	findPrivateChatBetweenUsers(userId1: string, userId2: string): Promise<IChat | null>;
	getUserChats(userId: string): Promise<IChatDTO[]>;
	updateLastMessage(chatId: string, messageId: string): Promise<void>;
}

import { ChatEntity } from "../../domain/entities/chat.entity";
import { IChatDTO } from "../dtos/chats.dto";
import { ISendMessageDTO } from "../dtos/message.dto";

export interface IGetUserChatsUseCase {
	execute(userId: string): Promise<IChatDTO[]>;
}

export interface IGetMessagesByChatUseCase {
	execute(chatId: string, page: number, limit: number): Promise<ISendMessageDTO[]>;
}

export interface ICreateChatUseCase {
	execute(userId1: string, userId2: string): Promise<ChatEntity>;
}

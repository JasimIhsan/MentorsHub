import { IChatDTO } from "../dtos/chats.dto";
import { ISendMessageDTO } from "../dtos/message.dto";

export interface IGetUserChatsUseCase {
	execute(userId: string): Promise<IChatDTO[]>;
}

export interface IGetMessagesByChatUseCase {
	execute(chatId: string, page: number, limit: number): Promise<ISendMessageDTO[]>;
}

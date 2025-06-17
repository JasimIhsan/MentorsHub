// domain/repositories/message.repository.ts
import { ISendMessageDTO } from "../../application/dtos/message.dto";
import { MessageEntity } from "../entities/message.entity";

export interface IMessageRepository {
	sendMessage(message: Omit<MessageEntity, "id" | "createdAt" | "updatedAt">): Promise<ISendMessageDTO>;
	getMessagesByChat(chatId: string, page: number, limit: number): Promise<ISendMessageDTO[]>;
	markMessageAsRead(messageId: string, userId: string): Promise<void>;
	getUnreadCount(chatId: string, userId: string): Promise<number>;
}

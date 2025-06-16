// domain/repositories/message.repository.ts
import { MessageEntity } from "../entities/message.entity";

export interface IMessageRepository {
	sendMessage(message: Omit<MessageEntity, "id" | "createdAt" | "updatedAt">): Promise<MessageEntity>;
	getMessagesByChat(chatId: string, page: number, limit: number): Promise<MessageEntity[]>;
	markMessageAsRead(messageId: string, userId: string): Promise<void>;
	getUnreadCount(chatId: string, userId: string): Promise<number>;
}

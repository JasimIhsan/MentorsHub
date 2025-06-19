// domain/repositories/message.repository.ts
import { ISendMessageDTO } from "../../application/dtos/message.dto";
import { MessageEntity } from "../entities/message.entity";

export interface IMessageRepository {
	findById(id: string): Promise<MessageEntity | null>;
	sendMessage(message: Omit<MessageEntity, "id" | "createdAt" | "updatedAt">): Promise<ISendMessageDTO>;
	findLastMessageByChatId(chatId: string): Promise<MessageEntity | null>;
	getMessagesByChat(chatId: string, page: number, limit: number): Promise<ISendMessageDTO[]>;
	markMessageAsRead(messageId: string, userId: string): Promise<void>;
	findUnreadMessages(chatId: string, userId: string): Promise<MessageEntity[]>;
	getUnreadCountsByUser(userId: string, chatIds: string[]): Promise<{ [chatId: string]: number }>;
	deleteMessage(messageId: string): Promise<void>;
}

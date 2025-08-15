// domain/repositories/message.repository.ts
import { MessageEntity } from "../entities/message.entity";

export interface IMessageRepository {
	create(msg: MessageEntity): Promise<MessageEntity>;
	findByChat(chatId: string, page: number, limit: number): Promise<MessageEntity[]>;
	markAsRead(messageId: string, userId: string): Promise<void>;
	unreadCountsByUser(userId: string, chatIds: string[]): Promise<Record<string, number>>;
	deleteById(messageId: string): Promise<void>;
	findById(id: string): Promise<MessageEntity | null>;
	findByIds(ids: string[]): Promise<MessageEntity[]>;
	findLastByChat(chatId: string): Promise<MessageEntity | null>;
	findUnread(chatId: string, userId: string): Promise<MessageEntity[]>;
	markAllUnreadByChat(chatId: string, userId: string): Promise<void>
}

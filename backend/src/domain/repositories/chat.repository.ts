import { ChatEntity } from "../entities/chat.entity";

export interface IChatRepository {
  create(participantIds: string[], isGroup: boolean, name?: string, admin?: string): Promise<ChatEntity>;
  findById(id: string): Promise<ChatEntity | null>;
  findPrivateBetween(user1: string, user2: string): Promise<ChatEntity | null>;
  findByUser(userId: string): Promise<ChatEntity[]>;
  updateLastMessage(chatId: string, messageId: string): Promise<void>;
}

// infrastructure/repositories/message.repository.impl.ts
import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { MessageEntity } from "../../../domain/entities/message.entity";
import { MessageModel } from "../models/text-message/message.model";

export class MessageRepositoryImpl implements IMessageRepository {
	async sendMessage(raw: Omit<MessageEntity, "id" | "createdAt" | "updatedAt">): Promise<MessageEntity> {
		const doc = await MessageModel.create({
			chatId: raw.chatId,
			sender: raw.sender,
			content: raw.content,
			type: raw.type,
			fileUrl: raw.fileUrl,
			readBy: [raw.sender], // sender already read
		});
		return MessageEntity.mapToMessageEntity(doc);
	}

	async getMessagesByChat(chatId: string, page = 1, limit = 20): Promise<MessageEntity[]> {
		const messages = await MessageModel.find({ chatId })
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.exec();
		return messages.map(MessageEntity.mapToMessageEntity);
	}

	async markMessageAsRead(messageId: string, userId: string): Promise<void> {
		await MessageModel.updateOne({ _id: messageId, readBy: { $ne: userId } }, { $push: { readBy: userId } });
	}

	async getUnreadCount(chatId: string, userId: string): Promise<number> {
		return MessageModel.countDocuments({
			chatId,
			readBy: { $ne: userId },
		});
	}
}

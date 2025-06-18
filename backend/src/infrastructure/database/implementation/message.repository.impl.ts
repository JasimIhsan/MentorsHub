// infrastructure/repositories/message.repository.impl.ts
import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { MessageEntity } from "../../../domain/entities/message.entity";
import { MessageModel } from "../models/text-message/message.model";
import { ISendMessageDTO } from "../../../application/dtos/message.dto";

export class MessageRepositoryImpl implements IMessageRepository {
	async sendMessage(raw: Omit<MessageEntity, "id" | "createdAt" | "updatedAt">): Promise<ISendMessageDTO> {
		const doc = await MessageModel.create({
			chatId: raw.chatId,
			sender: raw.sender,
			content: raw.content,
			type: raw.type,
			fileUrl: raw.fileUrl,
			readBy: [raw.sender],
		});
		return this.mapToMessageDTO(doc);
	}

	async getMessagesByChat(chatId: string, page = 1, limit = 20): Promise<ISendMessageDTO[]> {
		const messages = await MessageModel.find({ chatId })
			.sort({ createdAt: 1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.exec();
		return messages.map((doc) => this.mapToMessageDTO(doc));
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

	async deleteMessage(messageId: string): Promise<void> {
		const message = await MessageModel.deleteOne({ _id: messageId });
		if (!message) throw new Error("Message not found");
	}

	async findById(id: string): Promise<MessageEntity | null> {
		const message = await MessageModel.findById(id);
		return message ? MessageEntity.mapToMessageEntity(message) : null;
	}

	async findLastMessageByChatId (chatId: string): Promise<MessageEntity | null> {
		const lastMessage = await MessageModel.findOne({ chatId }).sort({ createdAt: -1 }).exec();
		return lastMessage ? MessageEntity.mapToMessageEntity(lastMessage) : null;
	}

	mapToMessageDTO = (doc: any): ISendMessageDTO => ({
		id: doc._id.toString(),
		chatId: doc.chatId.toString(),
		sender: {
			id: doc.sender._id.toString(),
			firstName: doc.sender.firstName,
			lastName: doc.sender.lastName,
			avatar: doc.sender.avatar,
		},
		content: doc.content,
		type: doc.type,
		fileUrl: doc.fileUrl,
		readBy: doc.readBy.map((id: any) => id.toString()),
		createdAt: doc.createdAt,
		updatedAt: doc.updatedAt,
	});
}

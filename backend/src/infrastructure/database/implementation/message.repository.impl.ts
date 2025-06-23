import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { MessageEntity } from "../../../domain/entities/message.entity";
import { MessageModel } from "../models/text-message/message.model";
import { ISendMessageDTO } from "../../../application/dtos/message.dto";
import mongoose from "mongoose";
import { handleExceptionError } from "../../utils/handle.exception.error";

export class MessageRepositoryImpl implements IMessageRepository {
	async sendMessage(raw: Omit<MessageEntity, "id" | "createdAt" | "updatedAt">): Promise<ISendMessageDTO> {
		try {
			const doc = await MessageModel.create({
				chatId: raw.chatId,
				sender: raw.sender,
				content: raw.content,
				type: raw.type,
				fileUrl: raw.fileUrl,
				readBy: [raw.sender],
			});
			return this.mapToMessageDTO(doc);
		} catch (error) {
			return handleExceptionError(error, "Error sending message");
		}
	}

	async getMessagesByChat(chatId: string, page = 1, limit = 20): Promise<ISendMessageDTO[]> {
		try {
			const messages = await MessageModel.find({ chatId })
				.sort({ createdAt: 1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.exec();
			return messages.map((doc) => this.mapToMessageDTO(doc));
		} catch (error) {
			return handleExceptionError(error, "Error fetching messages by chat");
		}
	}

	async markMessageAsRead(messageId: string, userId: string): Promise<void> {
		try {
			await MessageModel.updateOne({ _id: messageId, readBy: { $ne: userId } }, { $push: { readBy: userId } });
		} catch (error) {
			return handleExceptionError(error, "Error marking message as read");
		}
	}

	async getUnreadCountsByUser(userId: string, chatIds: string[]): Promise<{ [chatId: string]: number }> {
		try {
			const userObjectId = new mongoose.Types.ObjectId(userId);
			const results = await MessageModel.aggregate([
				{
					$match: {
						chatId: { $in: chatIds.map((id) => new mongoose.Types.ObjectId(id)) },
						readBy: { $ne: userObjectId },
					},
				},
				{
					$group: {
						_id: "$chatId",
						unreadCount: { $sum: 1 },
					},
				},
			]);

			const countMap: { [chatId: string]: number } = {};
			for (const result of results) {
				countMap[result._id.toString()] = result.unreadCount;
			}
			for (const chatId of chatIds) {
				if (!(chatId in countMap)) countMap[chatId] = 0;
			}

			return countMap;
		} catch (error) {
			return handleExceptionError(error, "Error getting unread message counts");
		}
	}

	async deleteMessage(messageId: string): Promise<void> {
		try {
			const result = await MessageModel.deleteOne({ _id: messageId });
			if (result.deletedCount === 0) {
				throw new Error("Message not found");
			}
		} catch (error) {
			return handleExceptionError(error, "Error deleting message");
		}
	}

	async findById(id: string): Promise<MessageEntity | null> {
		try {
			const message = await MessageModel.findById(id);
			return message ? MessageEntity.mapToMessageEntity(message) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding message by ID");
		}
	}

	async findLastMessageByChatId(chatId: string): Promise<MessageEntity | null> {
		try {
			const lastMessage = await MessageModel.findOne({ chatId }).sort({ createdAt: -1 }).exec();
			return lastMessage ? MessageEntity.mapToMessageEntity(lastMessage) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding last message in chat");
		}
	}

	async findUnreadMessages(chatId: string, userId: string): Promise<MessageEntity[]> {
		try {
			const unreadDocs = await MessageModel.find({
				chatId,
				readBy: { $ne: userId },
			}).exec();

			return unreadDocs.map((doc) => MessageEntity.mapToMessageEntity(doc));
		} catch (error) {
			return handleExceptionError(error, "Error finding unread messages");
		}
	}

	mapToMessageDTO = (doc: any): ISendMessageDTO => ({
		id: doc._id.toString(),
		chatId: doc.chatId.toString(),
		sender: {
			id: doc.sender._id?.toString?.() || doc.sender.toString(),
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

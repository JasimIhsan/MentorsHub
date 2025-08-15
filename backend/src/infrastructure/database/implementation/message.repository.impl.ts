import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { MessageEntity } from "../../../domain/entities/message.entity";
import { MessageModel } from "../models/text-message/message.model";
import mongoose from "mongoose";
import { handleExceptionError } from "../../utils/handle.exception.error";

export class MessageRepositoryImpl implements IMessageRepository {
	async create(raw: Omit<MessageEntity, "id" | "createdAt" | "updatedAt">): Promise<MessageEntity> {
		try {
			const doc = await MessageModel.create({
				chatId: raw.chatId,
				sender: raw.senderId,
				content: raw.content,
				type: raw.type,
				fileUrl: raw.fileUrl,
				readBy: [raw.senderId],
			});
			return MessageEntity.fromDBDocument(doc);
		} catch (error) {
			return handleExceptionError(error, "Error sending message");
		}
	}

	async findByChat(chatId: string, page = 1, limit = 20): Promise<MessageEntity[]> {
		try {
			const messages = await MessageModel.find({ chatId })
				.sort({ createdAt: 1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.exec();
			return messages.map(MessageEntity.fromDBDocument);
		} catch (error) {
			return handleExceptionError(error, "Error fetching messages by chat");
		}
	}

	async markAsRead(messageId: string, userId: string): Promise<void> {
		try {
			await MessageModel.updateOne({ _id: messageId, readBy: { $ne: userId } }, { $push: { readBy: userId } });
		} catch (error) {
			return handleExceptionError(error, "Error marking message as read");
		}
	}

	async unreadCountsByUser(userId: string, chatIds: string[]): Promise<{ [chatId: string]: number }> {
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

	async deleteById(messageId: string): Promise<void> {
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
			return message ? MessageEntity.fromDBDocument(message) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding message by ID");
		}
	}

	async findByIds(ids: string[]): Promise<MessageEntity[]> {
		try {
			const messages = await MessageModel.find({ _id: { $in: ids } });
			return messages.map(MessageEntity.fromDBDocument);
		} catch (error) {
			return handleExceptionError(error, "Error finding messages by IDs");
		}
	}

	async findLastByChat(chatId: string): Promise<MessageEntity | null> {
		try {
			const lastMessage = await MessageModel.findOne({ chatId }).sort({ createdAt: -1 }).exec();
			return lastMessage ? MessageEntity.fromDBDocument(lastMessage) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding last message in chat");
		}
	}

	async findUnread(chatId: string, userId: string): Promise<MessageEntity[]> {
		try {
			const unreadDocs = await MessageModel.find({
				chatId,
				readBy: { $ne: userId },
			}).exec();

			return unreadDocs.map((doc) => MessageEntity.fromDBDocument(doc));
		} catch (error) {
			return handleExceptionError(error, "Error finding unread messages");
		}
	}

	async markAllUnreadByChat(chatId: string, userId: string): Promise<void> {
		try {
			await MessageModel.updateMany({ chatId, readBy: { $ne: userId } }, { $push: { readBy: userId } });
		} catch (error) {
			return handleExceptionError(error, "Error marking all messages as read");
		}
	}
}

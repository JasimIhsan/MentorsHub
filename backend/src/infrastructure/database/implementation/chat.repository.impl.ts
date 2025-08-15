import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { ChatEntity } from "../../../domain/entities/chat.entity";
import { ChatModel } from "../models/text-message/chat.model";
import { handleExceptionError } from "../../utils/handle.exception.error";

export class ChatRepositoryImpl implements IChatRepository {
	async create(participants: string[], isGroup: boolean, name?: string, admin?: string): Promise<ChatEntity> {
		try {
			const doc = await new ChatModel({
				isGroupChat: isGroup,
				name: isGroup ? name : undefined,
				participants,
				groupAdmin: isGroup ? admin : undefined,
			}).save();
			return ChatEntity.fromDbDocument(doc);
		} catch (err) {
			return handleExceptionError(err, "Error creating chat");
		}
	}

	async findById(id: string): Promise<ChatEntity | null> {
		try {
			const doc = await ChatModel.findById(id).exec();
			return doc ? ChatEntity.fromDbDocument(doc) : null;
		} catch (err) {
			return handleExceptionError(err, "Error finding chat by ID");
		}
	}

	async findPrivateBetween(u1: string, u2: string): Promise<ChatEntity | null> {
		try {
			const doc = await ChatModel.findOne({
				isGroupChat: false,
				participants: { $all: [u1, u2], $size: 2 },
			}).exec();
			return doc ? ChatEntity.fromDbDocument(doc) : null;
		} catch (err) {
			return handleExceptionError(err, "Error finding private chat");
		}
	}

	async findByUser(userId: string): Promise<ChatEntity[]> {
		try {
			const docs = await ChatModel.find({ participants: userId }).sort({ updatedAt: -1 }).exec();
			return docs.map(ChatEntity.fromDbDocument);
		} catch (err) {
			return handleExceptionError(err, "Error getting user chats");
		}
	}

	async updateLastMessage(chatId: string, messageId: string): Promise<void> {
		try {
			await ChatModel.findByIdAndUpdate(chatId, {
				lastMessage: messageId,
				updatedAt: new Date(),
			});
		} catch (err) {
			return handleExceptionError(err, "Error updating last message");
		}
	}
}

import { Types } from "mongoose";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IChat, ChatModel } from "../models/text-message/chat.model";
import { ChatEntity } from "../../../domain/entities/chat.entity";
import { IUserSummaryDTO, IMessageSummaryDTO, IChatDTO } from "../../../application/dtos/chats.dto";
import { handleExceptionError } from "../../utils/handle.exception.error";

export class ChatRepositoryImpl implements IChatRepository {
	async createChat(participantIds: string[], isGroupChat: boolean, name?: string, groupAdmin?: string): Promise<IChat> {
		try {
			const chat = new ChatModel({
				isGroupChat,
				name: isGroupChat ? name : undefined,
				participants: participantIds,
				groupAdmin: isGroupChat ? groupAdmin : undefined,
			});
			return await chat.save();
		} catch (error) {
			return handleExceptionError(error, "Error creating chat");
		}
	}

	async findChatById(chatId: string): Promise<IChat | null> {
		try {
			return await ChatModel.findById(chatId).populate("lastMessage").exec();
		} catch (error) {
			return handleExceptionError(error, "Error finding chat by ID");
		}
	}

	async findPrivateChatBetweenUsers(userId1: string, userId2: string): Promise<IChat | null> {
		try {
			return await ChatModel.findOne({
				isGroupChat: false,
				participants: { $all: [userId1, userId2], $size: 2 },
			}).exec();
		} catch (error) {
			return handleExceptionError(error, "Error finding private chat between users");
		}
	}

	async getUserChats(userId: string): Promise<IChatDTO[]> {
		try {
			const chats = await ChatModel.find({ participants: userId })
				.sort({ updatedAt: -1 })
				.populate("participants", "firstName lastName avatar")
				.populate({
					path: "lastMessage",
					populate: {
						path: "sender",
						select: "firstName lastName avatar",
					},
				})
				.exec();

			return chats.map((chat) => this.mapToChatDTO(chat, userId));
		} catch (error) {
			return handleExceptionError(error, "Error getting user chats");
		}
	}

	async updateLastMessage(chatId: string, messageId: string): Promise<void> {
		try {
			await ChatModel.findByIdAndUpdate(chatId, {
				lastMessage: messageId,
				updatedAt: new Date(),
			});
		} catch (error) {
			return handleExceptionError(error, "Error updating last message");
		}
	}

	private mapToUserSummary = (user: any): IUserSummaryDTO => ({
		id: user._id.toString(),
		firstName: user.firstName,
		lastName: user.lastName,
		avatar: user.avatar,
	});

	private mapToMessageSummary = (message: any): IMessageSummaryDTO => ({
		id: message._id.toString(),
		content: message.content,
		type: message.type,
		sender: this.mapToUserSummary(message.sender),
		createdAt: message.createdAt,
	});

	private mapToChatDTO = (doc: IChat, currentUserId: string): IChatDTO => {
		const allParticipants = Array.isArray(doc.participants) ? doc.participants.map((p: any) => this.mapToUserSummary(p)) : [];

		const visibleParticipants = doc.isGroupChat ? allParticipants : allParticipants.filter((p) => p.id !== currentUserId);

		return {
			id: doc._id?.toString() as string,
			isGroupChat: doc.isGroupChat,
			name: doc.name,
			participants: visibleParticipants,
			groupAdmin: doc.groupAdmin ? this.mapToUserSummary(doc.groupAdmin as any) : undefined,
			lastMessage: doc.lastMessage ? this.mapToMessageSummary(doc.lastMessage as any) : undefined,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	};
}

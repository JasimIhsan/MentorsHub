import { Types } from "mongoose";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IChat, ChatModel } from "../models/text-message/chat.model";
import { ChatEntity } from "../../../domain/entities/chat.entity";
import { IUserSummaryDTO, IMessageSummaryDTO, IChatDTO } from "../../../application/dtos/chats.dto";

export class ChatRepositoryImpl implements IChatRepository {
	async createChat(participantIds: string[], isGroupChat: boolean, name?: string, groupAdmin?: string): Promise<IChat> {
		const chat = new ChatModel({
			isGroupChat,
			name: isGroupChat ? name : undefined,
			participants: participantIds,
			groupAdmin: isGroupChat ? groupAdmin : undefined,
		});
		return await chat.save();
	}

	async findChatById(chatId: string): Promise<IChat | null> {
		const chats = await ChatModel.findById(chatId).populate("lastMessage").exec();
		return chats;
	}

	async findPrivateChatBetweenUsers(userId1: string, userId2: string): Promise<IChat | null> {
		return ChatModel.findOne({
			isGroupChat: false,
			participants: { $all: [userId1, userId2], $size: 2 },
		}).exec();
	}

	async getUserChats(userId: string): Promise<IChatDTO[]> {
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
	}

	async updateLastMessage(chatId: string, messageId: string): Promise<void> {
		await ChatModel.findByIdAndUpdate(chatId, {
			lastMessage: messageId,
			updatedAt: new Date(),
		});
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

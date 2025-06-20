import { MessageEntity, MessageType } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { ISendMessageDTO } from "../../dtos/message.dto";
import mongoose from "mongoose";

export class SendMessageUseCase {
	constructor(private readonly messageRepo: IMessageRepository, private readonly chatRepo: IChatRepository) {}

	async execute(data: { chatId?: string; sender: string; receiver: string; content: string; type: MessageType; fileUrl?: string }): Promise<ISendMessageDTO> {
		let chatId = data.chatId;

		// 1. If no chatId is provided or chat doesn't exist, create new chat
		if (!chatId || !(await this.chatRepo.findChatById(chatId))) {
			const existingChat = await this.chatRepo.findPrivateChatBetweenUsers(data.sender, data.receiver);
			if (existingChat) {
				chatId = existingChat._id?.toString();
			} else {
				const newChat = await this.chatRepo.createChat([data.sender, data.receiver], false);
				chatId = newChat._id?.toString();
			}
		}

		if (!chatId) throw new Error("Chat not found");

		// 22. Create message
		const message = new MessageEntity({
			id: "",
			chatId,
			sender: data.sender,
			content: data.content,
			type: data.type,
			fileUrl: data.fileUrl,
			readBy: [data.sender],
		});

		// 3.Send message
		const savedMessage = await this.messageRepo.sendMessage(message);

		// 4. Update chat's last message
		await this.chatRepo.updateLastMessage(chatId, savedMessage.id);

		return savedMessage;
	}
}

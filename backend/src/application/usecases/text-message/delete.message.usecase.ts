// application/usecases/delete-message/deleteMessageUseCase.ts

import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IMessageRepository } from "../../../domain/repositories/message.repository";

interface DeleteMessageInput {
	messageId: string;
	chatId: string;
	senderId: string;
}

export class DeleteMessageUseCase {
	constructor(private readonly messageRepo: IMessageRepository, private readonly chatRepo: IChatRepository) {}

	async execute(data: DeleteMessageInput): Promise<string> {
		const { messageId, chatId, senderId } = data;

		const message = await this.messageRepo.findById(messageId);
		if (!message) throw new Error("Message not found");

		if (message.sender.toString() !== senderId) {
			throw new Error("Unauthorized delete");
		}

		await this.messageRepo.deleteMessage(messageId);

		const lastMessage = await this.messageRepo.findLastMessageByChatId(chatId);

		await this.chatRepo.updateLastMessage(chatId, lastMessage?.id as string);
		return messageId;
	}
}

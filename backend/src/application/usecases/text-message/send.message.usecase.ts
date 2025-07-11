import { MessageEntity, MessageType } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ISendMessageDTO, mapToSendMessageDTO } from "../../dtos/message.dto";

interface SendMessageInput {
	chatId?: string; // If known
	sender: string;
	receiver: string;
	content: string;
	type: MessageType;
	fileUrl?: string;
}

export class SendMessageUseCase {
	constructor(private readonly messageRepo: IMessageRepository, private readonly chatRepo: IChatRepository, private readonly userRepo: IUserRepository) {}

	async execute(data: SendMessageInput): Promise<ISendMessageDTO> {
		const { chatId, sender, receiver, content, type, fileUrl } = data;

		// Validate sender and receiver
		const senderUser = await this.userRepo.findUserById(sender);
		if (!senderUser) throw new Error("User not found");

		const receiverUser = await this.userRepo.findUserById(receiver);
		if (!receiverUser) {
			await this.chatRepo.findPrivateBetween(sender, receiver);
		};

		// Get or create the chat
		let chat = chatId ? await this.chatRepo.findById(chatId) : await this.chatRepo.findPrivateBetween(sender, receiver);

		if (!chat) {
			chat = await this.chatRepo.create([sender, receiver], false);
		}

		// Create message entity
		const message = new MessageEntity({
			id: "",
			chat: chat.id,
			sender,
			content,
			type,
			fileUrl,
			readBy: [sender],
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// Save message
		const savedMessage = await this.messageRepo.create(message);

		// Update last message in chat
		await this.chatRepo.updateLastMessage(chat.id, savedMessage.id);

		// Map to DTO with proper sender
		return mapToSendMessageDTO(savedMessage, senderUser);
	}
}

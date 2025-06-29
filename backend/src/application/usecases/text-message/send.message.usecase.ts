import { MessageEntity, MessageType } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { ISendMessageDTO, mapToSendMessageDTO } from "../../dtos/message.dto";
import { IUserRepository } from "../../../domain/repositories/user.repository";

interface SendMessageInput {
	chatId?: string; // existing chat (optional)
	sender: string; // current user ID
	receiver: string; // other user ID
	content: string;
	type: MessageType;
	fileUrl?: string;
}

export class SendMessageUseCase {
	constructor(private readonly messageRepo: IMessageRepository, private readonly chatRepo: IChatRepository, private readonly userRepo: IUserRepository) {}

	async execute(data: SendMessageInput): Promise<ISendMessageDTO> {
		// 1️⃣ Resolve (or create) the chat
		let chatId = data.chatId;
		let chat = chatId ? await this.chatRepo.findChatById(chatId) : null;

		if (!chat) {
			chat = await this.chatRepo.findPrivateChatBetweenUsers(data.sender, data.receiver);

			if (!chat) {
				chat = await this.chatRepo.createChat([data.sender, data.receiver], /* isGroupChat */ false);
			}

			chatId = chat.id;
		}

		if (!chatId) {
			throw new Error("Chat not found or could not be created.");
		}

		// 2️⃣ Build the MessageEntity
		const message = new MessageEntity({
			id: "",
			chatId,
			sender: data.sender,
			content: data.content,
			type: data.type,
			fileUrl: data.fileUrl,
			readBy: [data.sender],
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// 3️⃣ Persist the message
		const savedMessage = await this.messageRepo.sendMessage(message);

		// 4️⃣ Update chat’s lastMessage pointer
		await this.chatRepo.updateLastMessage(chatId, savedMessage.id);

		const sender = await this.userRepo.findUserById(data.sender);
		if (!sender) throw new Error("Sender not found");

		const dto = mapToSendMessageDTO(message, sender);

		return dto;
	}
}

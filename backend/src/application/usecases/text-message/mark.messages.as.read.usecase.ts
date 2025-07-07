import { MessageEntity } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ISendMessageDTO, mapToSendMessageDTO } from "../../dtos/message.dto";

export class MarkMessageReadUseCase {
	constructor(private readonly messageRepo: IMessageRepository, private readonly userRepo: IUserRepository) {}

	async execute(chatId: string, userId: string): Promise<ISendMessageDTO[]> {
		// 1. Get all unread messages in the chat for this user
		const unreadMessages = await this.messageRepo.findUnread(chatId, userId);
		if (unreadMessages.length === 0) return [];

		// 2. Mark each message as read by this user
		await Promise.all(unreadMessages.map((message) => this.messageRepo.markAsRead(message.id, userId)));

		// 3. Collect unique senderIds from those messages
		const senderIds = [...new Set(unreadMessages.map((m) => m.senderId))];

		// 4. Fetch those users
		const senders = await this.userRepo.findUsersByIds(senderIds);

		// 5. Build a map of senderId => user
		const senderMap = new Map(senders.map((user) => [user.id, user]));

		// 6. Map each message with correct sender
		const updatedDtos: ISendMessageDTO[] = unreadMessages.map((message) => {
			const sender = senderMap.get(message.senderId);
			if (!sender) throw new Error(`Sender not found for message: ${message.id}`);
			return mapToSendMessageDTO(message, sender);
		});

		return updatedDtos;
	}
}

import { IMessageRepository } from "../../../domain/repositories/message.repository";

export class MarkAllMessagesAsReadUseCase {
	constructor(private readonly messageRepo: IMessageRepository) {}

	async execute(chatId: string, userId: string): Promise<void> {
		// 1. Mark all unread messages in this chat as read for the given user
		await this.messageRepo.markAllUnreadByChat(chatId, userId);
	}
}

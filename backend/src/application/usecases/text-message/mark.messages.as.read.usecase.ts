import { MessageEntity } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository";

export class MarkMessageReadUseCase {
	constructor(private readonly messageRepo: IMessageRepository) {}

	async execute(chatId: string, userId: string): Promise<MessageEntity[]> {

		const unreadMessages = await this.messageRepo.findUnreadMessages(chatId, userId)
		for(let message of unreadMessages){
			await this.messageRepo.markMessageAsRead(message.id, userId)
		}

		return unreadMessages
	}
}

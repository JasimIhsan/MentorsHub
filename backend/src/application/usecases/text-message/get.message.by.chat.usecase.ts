import { MessageEntity } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository";


export class GetMessagesUseCase {
	constructor(private readonly messageRepo: IMessageRepository) {}

	async execute(chatId: string, page = 1, limit = 20): Promise<MessageEntity[]> {
		return await this.messageRepo.getMessagesByChat(chatId, page, limit);
	}
}

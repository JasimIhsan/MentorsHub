import { MessageEntity } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { ISendMessageDTO } from "../../dtos/message.dto";
import { IGetMessagesByChatUseCase } from "../../interfaces/messages";


export class GetMessagesByChatUseCase implements IGetMessagesByChatUseCase {
	constructor(private readonly messageRepo: IMessageRepository) {}

	async execute(chatId: string, page = 1, limit = 20): Promise<ISendMessageDTO[]> {
		return await this.messageRepo.getMessagesByChat(chatId, page, limit);
	}
}

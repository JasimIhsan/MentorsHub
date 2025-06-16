import { IMessageRepository } from "../../../domain/repositories/message.repository";

export class GetUnreadCountUseCase {
	constructor(private readonly messageRepo: IMessageRepository) {}

	async execute(chatId: string, userId: string): Promise<number> {
		return await this.messageRepo.getUnreadCount(chatId, userId);
	}
}

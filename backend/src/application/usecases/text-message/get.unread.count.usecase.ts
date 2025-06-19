import { IMessageRepository } from "../../../domain/repositories/message.repository";

export class GetMessageUnreadCountUseCase {
	constructor(private readonly messageRepo: IMessageRepository) {}

	async execute(userId: string, chatIds: string[]): Promise<{ [chatId: string]: number }> {
		return await this.messageRepo.getUnreadCountsByUser(userId, chatIds);
	}
}

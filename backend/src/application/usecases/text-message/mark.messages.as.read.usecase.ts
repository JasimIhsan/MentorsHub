import { IMessageRepository } from "../../../domain/repositories/message.repository";

export class MarkMessageReadUseCase {
	constructor(private readonly messageRepo: IMessageRepository) {}

	async execute(messageId: string, userId: string): Promise<void> {
		return await this.messageRepo.markMessageAsRead(messageId, userId);
	}
}

import { IMessageRepository } from "../../../domain/repositories/message.repository";

export class MarkMessageAsReadUseCase {
	constructor(private readonly _messageRepo: IMessageRepository) {}

	async execute(messageId: string, userId: string): Promise<void> {
		await this._messageRepo.markAsRead(messageId, userId);
	}
}

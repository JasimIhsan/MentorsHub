import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ISendMessageDTO, mapToSendMessageDTO } from "../../dtos/message.dto";
import { IGetMessagesByChatUseCase } from "../../interfaces/usecases/messages";

export class GetMessagesByChatUseCase implements IGetMessagesByChatUseCase {
	constructor(private readonly messageRepo: IMessageRepository, private readonly userRepo: IUserRepository) {}

	async execute(chatId: string, page = 1, limit = 20): Promise<ISendMessageDTO[]> {
		const messages = await this.messageRepo.findByChat(chatId, page, limit);

		const usersSet = new Set<string>();
		for (const message of messages) usersSet.add(message.senderId.toString());

		const users = await this.userRepo.findUsersByIds(Array.from(usersSet));

		const usersMap = new Map(users.map((u) => [u.id!, u]));

		return messages.map((message) => mapToSendMessageDTO(message, usersMap.get(message.senderId)!));
	}
}

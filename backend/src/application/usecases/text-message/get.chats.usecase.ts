import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IChatDTO } from "../../dtos/chats.dto";
import { IGetUserChatsUseCase } from "../../interfaces/messages";

export class GetUserChatsUseCase implements IGetUserChatsUseCase{
	constructor(private chatRepository: IChatRepository) {}

	async execute(userId: string): Promise<IChatDTO[]> {
		return await this.chatRepository.getUserChats(userId);
	}
}
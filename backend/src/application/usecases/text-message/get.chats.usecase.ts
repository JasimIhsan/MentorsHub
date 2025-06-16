import { ChatEntity } from "../../../domain/entities/chat.entity";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IChatDTO } from "../../dtos/chats.dto";
import { IGetUserChatsUseCase } from "../../interfaces/chats";

export class GetUserChatsUseCase implements IGetUserChatsUseCase{
	constructor(private chatRepository: IChatRepository) {}

	async execute(userId: string): Promise<IChatDTO[]> {
		return await this.chatRepository.getUserChats(userId);
	}
}
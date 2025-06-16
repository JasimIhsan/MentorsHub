import { IChatDTO } from "../dtos/chats.dto";

export interface IGetUserChatsUseCase {
	execute(userId: string): Promise<IChatDTO[]>;
}

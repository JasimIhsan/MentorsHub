import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { ChatEntity } from "../../../domain/entities/chat.entity";
import { ICreateChatUseCase } from "../../interfaces/usecases/messages";

export class CreateChatUseCase implements ICreateChatUseCase {
	constructor(private readonly chatRepository: IChatRepository) {}

	async execute(userId1: string, userId2: string): Promise<ChatEntity> {
		if (!userId1 || !userId2 || userId1 === userId2) {
			throw new Error("Invalid users");
		}

		// Step 1: Check if chat already exists
		const existingChat = await this.chatRepository.findPrivateBetween(userId1, userId2);
		if (existingChat) return existingChat;

		// Step 2: Create new chat
		const newChat = await this.chatRepository.create([userId1, userId2], false);

		return newChat;
	}
}

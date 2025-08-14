// ✅ 2. GetUserChatsUseCase (Populates DTOs)
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { IChatDTO, mapToChatDTO } from "../../dtos/chats.dto";
import { IGetUserChatsUseCase } from "../../interfaces/usecases/messages";

export class GetUserChatsUseCase implements IGetUserChatsUseCase {
	constructor(private readonly chatRepository: IChatRepository, private readonly userRepository: IUserRepository, private readonly messageRepository: IMessageRepository) {}

	async execute(userId: string): Promise<IChatDTO[]> {
		const chats = await this.chatRepository.findByUser(userId);

		// Collect all unique userIds and messageIds
		const userIds = new Set<string>();
		const messageIds = new Set<string>();

		chats.forEach((chat) => {
			chat.participants.forEach((uid) => userIds.add(uid));
			if (chat.groupAdmin) userIds.add(chat.groupAdmin);
			if (chat.lastMessage) messageIds.add(chat.lastMessage);
		});

		// Fetch all needed users and messages at once
		const [users, messages] = await Promise.all([this.userRepository.findUsersByIds([...userIds]), this.messageRepository.findByIds([...messageIds])]);

		// Map for fast access
		const userMap = new Map(users.map((u) => [u.id!, u]));
		const messageMap = new Map(messages.map((m) => [m.id, m]));

		// Build DTOs
		return chats.map((chat) => {
			const participants = chat.participants.map((id) => userMap.get(id)!);
			const groupAdmin = chat.groupAdmin ? userMap.get(chat.groupAdmin) : undefined;
			const lastMessage = chat.lastMessage ? messageMap.get(chat.lastMessage) : undefined;
			return mapToChatDTO(chat, participants, lastMessage, groupAdmin);
		});
	}
}

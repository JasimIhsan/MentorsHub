import { getMessageUnreadCountsByUser } from "./composer";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { Server } from "socket.io";

interface UpdateUnreadCountsParams {
	chatId: string;
	io: Server;
	excludeUserId?: string;
}

export class UpdateUnreadCountsForChatUseCase {
	constructor(private chatRepository: IChatRepository) {}

	async execute({ chatId, io, excludeUserId }: UpdateUnreadCountsParams): Promise<void> {
		try {
			// Fetch chat
			const chat = await this.chatRepository.findById(chatId);
			if (!chat) {
				throw new Error("Chat not found");
			}

			// Get participants, optionally excluding one user
			const participants = excludeUserId ? chat.participants.filter((id) => id.toString() !== excludeUserId) : chat.participants;

			// Update unread counts for each participant
			for (const participantId of participants) {
				const counts = await getMessageUnreadCountsByUser.execute(participantId, [chatId]);
				io.to(`user_${participantId}`).emit("unread-counts-response", counts);
			}
		} catch (err) {
			console.error("Error in UpdateUnreadCountsForChat:", err);
			throw err; // Let the caller handle the error
		}
	}
}

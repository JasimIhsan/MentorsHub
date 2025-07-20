import { Server, Socket } from "socket.io";
import { markMessagesAsReadUsecase } from "../../../application/usecases/text-message/composer";

export const registerChatConnectionHandlers = (io: Server, socket: Socket) => {
	// Join room
	socket.on("join-chat", async ({ chatId, userId }: { chatId: string; userId: string }) => {
		socket.join(`chat_${chatId}`);

		// Mark all unread messages in this chat as read for the given user
		try {
			await markMessagesAsReadUsecase.execute(chatId, userId);

			socket.to(`chat_${chatId}`).emit("messages-read", { chatId, readBy: userId });
		} catch (error) {
			socket.emit("error", { message: "Failed to mark messages as read" });
		}
	});

	socket.on("leave-chat", (chatId: string) => {
		socket.leave(`chat_${chatId}`);
	});
};

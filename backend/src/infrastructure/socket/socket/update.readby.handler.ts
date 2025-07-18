import { Server, Socket } from "socket.io";
import { markMessageAsReadUsecase } from "../../../application/usecases/text-message/composer";

export const registerMessageReadHandlers = (io: Server, socket: Socket) => {
	socket.on("mark-chat-as-read", async ({ chatId, userId }: { chatId: string; userId: string }) => {
		try {
			const messages = await markMessageAsReadUsecase.execute(chatId, userId);
			io.to(`chat_${chatId}`).emit("messages-read-update", {
				chatId,
				readerId: userId,
				messageIds: messages.map((msg) => msg.id),
			});
		} catch (error) {
			console.error("Error from registerMessageReadHandler : ", error);
		}
	});
};

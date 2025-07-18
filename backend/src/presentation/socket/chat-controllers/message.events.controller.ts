import { Server, Socket } from "socket.io";
import { markMessageAsReadUseCase, sendMessageUsecase } from "../../../application/usecases/text-message/composer";

export function registerMessageHandlers(io: Server, socket: Socket) {
	socket.on("send-message", async (messageData) => {
		const { chatId, senderId, receiverId, content, type = "text", fileUrl } = messageData;

		try {
			// 1. Call use case to handle message logic
			const message = await sendMessageUsecase.execute({
				chatId,
				sender: senderId,
				receiver: receiverId,
				content,
				type,
				fileUrl,
			});

			// 2. Emit the message to all users in the chat room
			io.to(`chat_${chatId}`).emit("receive-message", message);
		} catch (err) {
			console.error("send-message error:", err);
			socket.emit("error", { message: "Failed to send message" });
		}
	});

	socket.on("mark-message-as-read", async ({ messageId, chatId, userId }) => {
		if (!messageId || !chatId || !userId) return console.error("Missing required params to mark message as read: ", { messageId, chatId, userId });

		try {
			await markMessageAsReadUseCase.execute(messageId, userId);
			socket.to(`chat_${chatId}`).emit("messages-read", { chatId, readBy: userId });
		} catch (err) {
			console.error("mark-message-as-read error:", err);
			socket.emit("error", { message: "Failed to mark message as read" });
		}
	});
}

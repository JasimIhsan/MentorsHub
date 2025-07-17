import { Server, Socket } from "socket.io";

export function registerMessageHandlers(io: Server, socket: Socket) {
	socket.on("send-message", async (messageData) => {
		// const { chatId, senderId, receiverId, content, type = "text", fileUrl } = data;
		const { chatId } = messageData;

		console.log("📨 New message received:", messageData);
		// Save to DB
		// const savedMessage = await MessageUseCase.sendMessage(messageData);
		// const recieveMessage = {
		// 	...messageData,
		// 	id: Math.random().toString(36).substring(2, 9),
		// };

		// Send to users in chat
		io.to(`chat_${chatId}`).emit("receive-message", messageData);
	});
}

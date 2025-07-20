// File: infrastructure/socket/registerMessageHandlers.ts
import { Server, Socket } from "socket.io";
import { deleteMessageUseCase, getMessageUnreadCountsByUser, markMessageAsReadUseCase, sendMessageUsecase, updateUnreadCountsForChatUseCase } from "../../../application/usecases/text-message/composer";

export function registerMessageHandlers(io: Server, socket: Socket) {
	// Join user-specific room for targeted notifications
	socket.on("join-user", ({ userId }) => {
		socket.join(`user_${userId}`);
	});

	// Handle send-message
	socket.on("send-message", async (messageData) => {
		const { chatId, senderId, receiverId, content, type = "text", fileUrl } = messageData;

		try {
			if (!chatId || !senderId || (!receiverId && !messageData.isGroupChat)) {
				socket.emit("error", { message: "Invalid message data" });
				return;
			}

			// Call use case to handle message logic
			const message = await sendMessageUsecase.execute({
				chatId,
				sender: senderId,
				receiver: receiverId,
				content,
				type,
				fileUrl,
			});

			// Emit the message to all users in the chat room
			io.to(`chat_${chatId}`).emit("receive-message", message);

			// Update unread counts for all participants except the sender
			await updateUnreadCountsForChatUseCase.execute({ chatId, io, excludeUserId: senderId });
		} catch (err) {
			console.error("send-message error:", err);
			socket.emit("error", { message: "Failed to send message" });
		}
	});

	// Handle mark-message-as-read
	socket.on("mark-message-as-read", async ({ messageId, chatId, userId }) => {
		if (!messageId || !chatId || !userId) {
			console.error("Missing required params to mark message as read: ", { messageId, chatId, userId });
			socket.emit("error", { message: "Invalid messageId, chatId, or userId" });
			return;
		}

		try {
			await markMessageAsReadUseCase.execute(messageId, userId);
			// Emit to chat room to update read status
			io.to(`chat_${chatId}`).emit("messages-read", { chatId, userId });

			// Update unread counts for all chat participants
			await updateUnreadCountsForChatUseCase.execute({ chatId, io });
		} catch (err) {
			console.error("mark-message-as-read error:", err);
			socket.emit("error", { message: "Failed to mark message as read" });
		}
	});

	// Handle mark-chat-as-read
	socket.on("mark-chat-as-read", async ({ chatId, userId }) => {
		if (!chatId || !userId) {
			console.error("Missing required params to mark chat as read: ", { chatId, userId });
			socket.emit("error", { message: "Invalid chatId or userId" });
			return;
		}

		try {
			// Mark all unread messages in the chat as read
			await markMessageAsReadUseCase.execute(chatId, userId);
			// Emit to chat room to update read status
			io.to(`chat_${chatId}`).emit("messages-read", { chatId, userId });

			// Update unread counts for all chat participants
			await updateUnreadCountsForChatUseCase.execute({ chatId, io });
		} catch (err) {
			console.error("mark-chat-as-read error:", err);
			socket.emit("error", { message: "Failed to mark chat as read" });
		}
	});

	// Handle delete-message
	socket.on("delete-message", async ({ messageId, chatId, senderId }) => {
		if (!messageId || !chatId || !senderId) {
			console.error("Missing required params to delete message: ", { messageId, chatId, senderId });
			socket.emit("error", { message: "Invalid messageId, chatId, or senderId" });
			return;
		}

		try {
			await deleteMessageUseCase.execute({ messageId, chatId, senderId });
			io.to(`chat_${chatId}`).emit("message-deleted", { messageId, chatId });

			// Update unread counts for all chat participants
			await updateUnreadCountsForChatUseCase.execute({ chatId, io });
		} catch (err) {
			console.error("delete-message error:", err);
			socket.emit("error", { message: "Failed to delete message" });
		}
	});

	// Handle get-unread-counts
	socket.on("get-unread-counts", async ({ userId, chatIds }: { userId: string; chatIds: string[] }) => {
		try {
			if (!userId || !Array.isArray(chatIds) || chatIds.length === 0) {
				socket.emit("unread-counts-error", { message: "Invalid userId or chatIds" });
				return;
			}
			const counts = await getMessageUnreadCountsByUser.execute(userId, chatIds);
			socket.emit("unread-counts-response", counts);
		} catch (err) {
			console.error("get-unread-counts error:", err);
			socket.emit("unread-counts-error", { message: "Something went wrong" });
		}
	});

	socket.on("disconnect", () => {
	});
}

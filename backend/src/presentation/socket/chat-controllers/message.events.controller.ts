// File: infrastructure/socket/registerMessageHandlers.ts
import { Server, Socket } from "socket.io";
import { createChatUseCase, deleteMessageUseCase, getMessageUnreadCountsByUser, markMessageAsReadUseCase, sendMessageUsecase, updateUnreadCountsForChatUseCase } from "../../../application/usecases/text-message/composer";
import { userRepository } from "../../../infrastructure/composer";
import { mapToChatDTO } from "../../../application/dtos/chats.dto";

export function registerMessageHandlers(io: Server, socket: Socket) {
	// Join user-specific room for targeted notifications
	socket.on("join-user", ({ userId }) => {
		socket.join(`user_${userId}`);
	});

	// Handle send-message
	socket.on("send-message", async (messageData) => {
		const { chatId, senderId, receiverId, content, type = "text", fileUrl, isGroupChat } = messageData;

		try {
			if (!senderId || (!receiverId && !isGroupChat)) {
				socket.emit("error", { message: "Invalid message data" });
				return;
			}

			let finalChatId = chatId;
			let newChatEntity = null;

			// ✅ Step 1: Handle new 1-to-1 chat creation if needed
			if (!finalChatId && !isGroupChat) {
				newChatEntity = await createChatUseCase.execute(senderId, receiverId);
				finalChatId = newChatEntity.id;

				// ✅ Fetch users to build full IChatDTO
				const participants = await userRepository.findUsersByIds(newChatEntity.participants); // returns UserEntity[]
				const adminUser = newChatEntity.groupAdmin ? await userRepository.findUserById(newChatEntity.groupAdmin) : undefined;

				// ✅ Map to DTO
				const chatDTO = mapToChatDTO(newChatEntity, participants, undefined, adminUser);

				// ✅ Emit to both users
				io.to(`user_${senderId}`).emit("new-chat", chatDTO);
				io.to(`user_${receiverId}`).emit("new-chat", chatDTO);
			}

			// ✅ Step 2: Send the message
			const message = await sendMessageUsecase.execute({
				chatId: finalChatId,
				sender: senderId,
				receiver: receiverId,
				content,
				type,
				fileUrl,
			});

			// ✅ Step 3: Emit the message to the chat room
			io.to(`chat_${finalChatId}`).emit("receive-message", message);

			// ✅ Step 4: Update unread counts for others
			await updateUnreadCountsForChatUseCase.execute({
				chatId: finalChatId,
				io,
				excludeUserId: senderId,
			});
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

	socket.on("disconnect", () => {});
}

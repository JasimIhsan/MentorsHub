import { Server, Socket } from "socket.io";
import { joinChatRoom } from "./utils/join.chat.room";
import { ChatParticipant } from "../../context";

export const registerChatConnectionHandlers = (io: Server, socket: Socket) => {
	// Join room
	socket.on("join-chat", (chatId: string) => {
		socket.join(`chat_${chatId}`);

		// joinChatRoom(`chat_${chatId}`, participant);

		console.log(`👥 Socket ${socket.id} joined room: ${chatId}`);
	});

	socket.on("leave-chat", (chatId: string) => {
		socket.leave(`chat_${chatId}`);
		console.log(`👥 Socket ${socket.id} left room: ${chatId}`);
	});
};

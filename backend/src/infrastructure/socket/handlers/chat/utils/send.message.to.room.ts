import { IMessage } from "peer";
import { Server } from "socket.io";
import { chatRooms } from "../../../context";

export function sendMessageToRoom(io: Server, chatId: string, message: IMessage) {
	const participants = chatRooms.get(chatId) || [];
	participants.forEach((p) => {
		io.to(p.socketId).emit("receive-message", message);
	});
}

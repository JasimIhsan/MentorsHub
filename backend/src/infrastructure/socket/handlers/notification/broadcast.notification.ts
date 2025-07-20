import { onlineUsers } from "../../context";

export function broadcastNotification(message: string) {
	onlineUsers.forEach((socket, userId) => {
		socket.emit("notify-user", { message });
		console.log(`📢 Broadcast to ${userId}`);
	});
}

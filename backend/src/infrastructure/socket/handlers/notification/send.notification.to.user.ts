import { onlineUsers } from "../../context";

export function sendNotificationToUser(userId: string, message: string) {
	const userSocket = onlineUsers.get(userId);
	if (userSocket) userSocket.emit("notify-user", { title: message });
	else console.error(`User ${userId} not found`);
}

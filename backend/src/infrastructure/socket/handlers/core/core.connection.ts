import { Server, Socket } from "socket.io";
import { onlineUsers } from "../../context";
import { broadcastOnlineUsers } from "../notification/utils/broadcast.online.users";
import { sendNotificationToUser } from "../notification/send.notification.to.user";

export function registerCoreConnectionHandlers(io: Server, socket: Socket) {
	// console.log(`socket.data : `, socket.data);
	const userId = socket.data.userId;
	const wasOffline = !onlineUsers.get(userId);

	onlineUsers.set(userId, socket);

	// console.log("🟢 Online users:", Array.from(onlineUsers.keys()));

	if (wasOffline) {
		broadcastOnlineUsers(io);
		sendNotificationToUser(userId, "👋 Welcome to the platform!");
		// broadcastNotification("New user joined the platform!");
	}

	socket.on("get-online-users", () => {
		broadcastOnlineUsers(io);
	});

	socket.on("disconnect", () => {
		broadcastOnlineUsers(io);
		onlineUsers.delete(userId);
	});
}

import { Server, Socket } from "socket.io";
import { onlineUsers } from "../../../infrastructure/socket/context";
import { broadcastOnlineUsers } from "../../../infrastructure/socket/handlers/notification/utils/broadcast.online.users";
// import { sendNotificationToUser } from "../../../infrastructure/socket/handlers/notification/send.notification.to.user";

export function registerCoreConnectionHandlers(io: Server, socket: Socket) {
	const userId = socket.data.userId;
	const wasOffline = !onlineUsers.get(userId);

	onlineUsers.set(userId, socket);

	if (wasOffline) {
		broadcastOnlineUsers(io);
		// sendNotificationToUser(userId, "👋 Welcome to the platform!");
	}

	socket.on("get-online-users", () => {
		broadcastOnlineUsers(io);
	});

	socket.on("disconnect", () => {
		broadcastOnlineUsers(io);
		onlineUsers.delete(userId);
	});
}

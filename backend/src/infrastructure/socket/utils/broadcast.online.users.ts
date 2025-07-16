import { Server } from "socket.io";
import { onlineUsers } from "../context";

export function broadcastOnlineUsers(io: Server){
	const payload = Array.from(onlineUsers.keys()).map(id => {
		return { userId: id, status: "online" };
	});
	io.emit("online-users", payload);
}
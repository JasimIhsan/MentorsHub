import { Server } from "socket.io";
import http from "http";

let io: Server;

export function createSocketServer(server: http.Server): Server {
	io = new Server(server, {
		cors: {
			origin: [process.env.FRONTEND_ORIGIN!],
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	return io;
}

export function getSocketServer(): Server {
	if (!io) throw new Error("Socket.IO server not initialized");
	return io;
}

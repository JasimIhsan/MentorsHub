import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { authMiddleware } from "./middlewares/auth";
import { registerCoreConnectionHandlers } from "./handlers/core/core.connection";
import { sendNotificationToUser } from "./handlers/notification/send.notification.to.user";

export function createSocketLayer(server: HTTPServer): Server {
	const io = new Server(server, {
		cors: {
			// origin: process.env.FRONTEND_ORIGIN,
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	// Optional: authenticate users here
	io.use(authMiddleware); // 👈 This attaches userId to socket.data (if needed)

	io.on("connection", (socket) => {
		console.log(`✅ Socket connected: ${socket.id}`);

		// Register User on core connection
		registerCoreConnectionHandlers(io, socket);

		
		// Placeholder for future feature handlers
		// registerChatHandlers(io, socket);
		// registerVideoSessionHandlers(io, socket, SessionModel);
		// registerNotificationHandlers(io, socket);
		// etc...

		socket.on("disconnect", (reason) => {
			console.log(`❌ Socket disconnected: ${socket.id} — Reason: ${reason}`);
		});
	});

	return io;
}

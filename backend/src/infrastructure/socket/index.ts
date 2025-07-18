import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { authMiddleware } from "./middlewares/auth";
import { registerCoreConnectionHandlers } from "../../presentation/socket/core/core.connection.controller";
import { registerChatConnectionHandlers } from "../../presentation/socket/chat-controllers/chat.connection.controller";
import { registerMessageHandlers } from "../../presentation/socket/chat-controllers/message.events.controller";

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
		registerChatConnectionHandlers(io, socket)

		
		// Placeholder for future feature handlers
		registerMessageHandlers(io, socket);
		// registerVideoSessionHandlers(io, socket, SessionModel);
		// registerNotificationHandlers(io, socket);
		// etc...

		socket.on("disconnect", (reason) => {
			console.log(`❌ Socket disconnected: ${socket.id} — Reason: ${reason}`);
		});
	});

	return io;
}

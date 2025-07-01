import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { app } from "./app";
import { logger } from "./infrastructure/utils/logger";
import initializeSocket from "./infrastructure/socket/socket.io";
import { SessionModel } from "./infrastructure/database/models/session/session.model";

dotenv.config();

const server = createServer(app);

export const io = new Server(server, {
	cors: {
		origin: [process.env.FRONTEND_ORIGIN!],
		methods: ["GET", "POST"],
		credentials: true,
	},
});

initializeSocket(io, SessionModel);

const PORT = process.env.PORT || 5858;

server.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT} : ✅✅✅`);
});

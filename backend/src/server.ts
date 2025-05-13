import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server, Socket } from "socket.io";
import connectDB from "./infrastructure/database/database.config";
import authRouter from "./presentation/routes/user/auth.routes";
import passport from "passport";
import { googleAuthRouter } from "./presentation/routes/user/google.auth.routes";
import { configurePassport } from "./infrastructure/auth/passport/passport.config";
import { tokenInterface, userRepository } from "./infrastructure/composer";
import { adminAuthRouter } from "./presentation/routes/admin/admin.auth.routes";
import { usertabRouter } from "./presentation/routes/admin/admin.usertab.routes";
import { userProfileRoutes } from "./presentation/routes/user/user.profile.routes";
import { mentorRouter } from "./presentation/routes/user/mentor.routes";
import { mentorApplicationRouter } from "./presentation/routes/admin/admin.mentor.application.routes";
import { sessionRouter } from "./presentation/routes/user/session.routes";
import { userSideMentorRouter } from "./presentation/routes/user/user.side.mentor.routes";
import { documentsRouter } from "./presentation/routes/common/documents.routes";
import { mentorSessionRouter } from "./presentation/routes/mentors/mentor.session.routes";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const sessions: { [sessionId: string]: { userId: string; peerId: string; socketId: string }[] } = {};

// Socket.IO session management
io.on("connection", (socket: Socket) => {
	console.log(`✅ User connected: ${socket.id}`);

	socket.on("join-session", ({ sessionId, userId, peerId }: { sessionId: string; userId: string; peerId: string }) => {
		console.log(`Received join-session: sessionId=${sessionId}, userId=${userId}, socketId=${socket.id}, peerId=${peerId}`);

		if (!sessions[sessionId]) {
			sessions[sessionId] = [];
		}
		sessions[sessionId].push({ userId, peerId, socketId: socket.id });
		socket.data.sessionId = sessionId;
		socket.data.userId = userId;

		sessions[sessionId].forEach((participant) => {
			if (participant.socketId !== socket.id) {
				io.to(participant.socketId).emit("user-joined", { peerId });
			}
		});
	});

	socket.on("mute-status", ({ userId, isMuted }) => {
		socket.broadcast.emit("mute-status", { userId, isMuted });
	});

	socket.on("video-status", ({ userId, isVideoOn }) => {
		socket.broadcast.emit("video-status", { userId, isVideoOn });
	});

	socket.on("hand-raise-status", ({ userId, isHandRaised }) => {
		socket.broadcast.emit("hand-raise-status", { userId, isHandRaised }); // Broadcast hand-raise status
	});

	socket.on("disconnect", (reason) => {
		const sessionId = socket.data.sessionId;
		const userId = socket.data.userId;

		if (sessionId && sessions[sessionId]) {
			sessions[sessionId] = sessions[sessionId].filter((participant) => participant.userId !== userId);
			if (sessions[sessionId].length === 0) {
				delete sessions[sessionId];
			}
		}

		console.log(`❌ User disconnected: ${socket.id}`);
	});

	socket.on("error", (error) => {
		console.error(`Socket error for ${socket.id}: ${error.message}`);
		socket.emit("error", { message: error.message });
	});

	socket.on("connect_error", (error) => {
		console.error(`Connect error for ${socket.id}: ${error.message}`);
	});
});

// Express Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(passport.initialize());
configurePassport(userRepository, tokenInterface);
app.use(helmet());
app.use(
	cors({
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);

connectDB();
app.use(morgan("dev"));

// Routes
app.use("/api/user", authRouter);
app.use("/api/user/auth", googleAuthRouter);
app.use("/api/user/user-profile", userProfileRoutes);
app.use("/api/user/sessions", sessionRouter);
app.use("/api/user/mentor", userSideMentorRouter);

app.use("/api/admin", adminAuthRouter);
app.use("/api/admin/users", usertabRouter);
app.use("/api/admin/mentor-application", mentorApplicationRouter);

app.use("/api/mentor", mentorRouter);
app.use("/api/mentor/sessions", mentorSessionRouter);

app.use("/api/documents", documentsRouter);

// Start the server
const PORT = process.env.PORT || 5858;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} : ✅✅✅`);
});

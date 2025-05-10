import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
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
import { mentorSessionRouter } from "./presentation/routes/mentors/mentor.session.routes";
import { userSideMentorRouter } from "./presentation/routes/user/user.side.mentor.routes";
import http from "http";
import { Server } from "socket.io";
import { documentsRouter } from "./presentation/routes/common/documents.routes";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// Socket.IO signaling for WebRTC
io.on("connection", (socket) => {
	console.log(`🔌 User connected: ${socket.id}`);

	// Join a session room
	socket.on("join-session", ({ sessionId, userId }) => {
		socket.join(sessionId);
		console.log(`User ${userId} joined session ${sessionId}`);
		// Notify others in the session
		socket.to(sessionId).emit("user-joined", { userId, socketId: socket.id });
	});

	// Handle WebRTC offer
	socket.on("offer", ({ sessionId, offer, to }) => {
		socket.to(to).emit("offer", { offer, from: socket.id });
	});

	// Handle WebRTC answer
	socket.on("answer", ({ sessionId, answer, to }) => {
		socket.to(to).emit("answer", { answer, from: socket.id });
	});

	// Handle ICE candidate
	socket.on("ice-candidate", ({ sessionId, candidate, to }) => {
		socket.to(to).emit("ice-candidate", { candidate, from: socket.id });
	});

	// Handle user disconnection
	socket.on("disconnect", () => {
		console.log(`🔌 User disconnected: ${socket.id}`);
		socket.rooms.forEach((room) => {
			if (room !== socket.id) {
				socket.to(room).emit("user-left", { socketId: socket.id });
			}
		});
	});
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(passport.initialize());
configurePassport(userRepository, tokenInterface);
app.use(helmet());
app.use(
	cors({
		origin: "http://localhost:5173",
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

server.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT} : ✅✅✅`);
});

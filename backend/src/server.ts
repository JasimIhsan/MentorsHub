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
import { SessionModel } from "./infrastructure/database/models/session/session.model";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// Store active sessions and their participants
const sessions: {
	[sessionId: string]: {
		userId: string;
		peerId: string;
		socketId: string;
		role: "mentor" | "user";
		isApproved?: boolean;
	}[];
} = {};

const activeCalls: { [sessionId: string]: string } = {};

// Socket.IO session management
io.on("connection", (socket: Socket) => {
	console.log(`✅ User connected: ${socket.id}`);

	socket.on("join-session", async ({ sessionId, userId, peerId, role }: { sessionId: string; userId: string; peerId: string; role: "mentor" | "user" }) => {
		console.log(`Received join-session: sessionId=${sessionId}, userId=${userId}, socketId=${socket.id}, peerId=${peerId}`);

		try {
			const session = await SessionModel.findById(sessionId);
			if (!session) {
				socket.emit("error", { message: "Session not found" });
				return;
			}

			if (!["upcoming", "ongoing"].includes(session.status)) {
				socket.emit("error", { message: "Session payment is not completed" });
				return;
			}

			if (!sessions[sessionId]) {
				sessions[sessionId] = [];
			}

			// Prevent duplicate joins
			// const isUserAlreadyJoined = sessions[sessionId].some((participant) => participant.userId === userId);
			// if (isUserAlreadyJoined) {
			// 	socket.emit("error", { message: "You are already in this session" });
			// 	return;
			// }

			if (role === "mentor") {
				if (session.mentorId.toString() !== userId) {
					socket.emit("error", { message: "You are not the mentor for this session" });
					return;
				}

				activeCalls[sessionId] = socket.id;
				sessions[sessionId].push({
					userId,
					peerId,
					socketId: socket.id,
					role,
					isApproved: true,
				});

				socket.join(sessionId);
				socket.data.sessionId = sessionId;
				socket.data.userId = userId;
				socket.data.role = role;

				console.log(`👩‍🎓 Mentor ${userId} joined session ${sessionId}`);
			} else {
				sessions[sessionId].push({
					userId,
					peerId,
					socketId: socket.id,
					role,
					isApproved: false,
				});

				socket.data.sessionId = sessionId;
				socket.data.userId = userId;
				socket.data.role = role;

				const mentor = sessions[sessionId].find((p) => p.role === "mentor");
				if (mentor) {
					io.to(mentor.socketId).emit("join-request", {
						userId,
						sessionId,
						peerId,
					});
				} else {
					socket.emit("error", { message: "Mentor not available. Please wait." });
				}

				console.log(`🫴 User ${userId} requested to join session ${sessionId}`);
			}
		} catch (error: any) {
			console.error(`Error in join-session: ${error.message}`);
			socket.emit("error", { message: "Failed to join session" });
		}
	});

	socket.on("approve-join", ({ userId, sessionId, approve, mentorPeerId }: { userId: string; sessionId: string; approve: boolean; mentorPeerId: string }) => {
		if (socket.data.role !== "mentor") {
			socket.emit("error", { message: "Only mentors can approve joins" });
			return;
		}

		const sessionParticipants = sessions[sessionId];
		if (!sessionParticipants) {
			socket.emit("error", { message: "Session not found" });
			return;
		}

		const user = sessionParticipants.find((p) => p.userId === userId);
		if (!user) {
			socket.emit("error", { message: "User not found in session" });
			return;
		}

		if (approve) {
			user.isApproved = true;
			io.to(user.socketId).emit("join-approved", { sessionId, mentorPeerId });
			const userSocket = io.sockets.sockets.get(user.socketId);
			if (userSocket) {
				userSocket.join(sessionId);
			}
			io.to(sessionId).emit("user-joined", { peerId: user.peerId });
			console.log(`User ${userId} approved for session ${sessionId}`);
		} else {
			const userSocket = io.sockets.sockets.get(user.socketId);
			if (userSocket) {
				console.log(`🫴❌ User ${userId} rejected for session ${sessionId}`);
				io.to(user.socketId).emit("join-rejected", { message: "Mentor rejected your join request" });
			}
			sessions[sessionId] = sessionParticipants.filter((p) => p.userId !== userId);
			// console.log(`🫴❌ User ${userId} rejected for session ${sessionId}`);
		}
	});

	socket.on("mute-status", ({ userId, isMuted }) => {
		socket.to(socket.data.sessionId).emit("mute-status", { userId, isMuted });
	});

	socket.on("video-status", ({ userId, isVideoOn }) => {
		socket.to(socket.data.sessionId).emit("video-status", { userId, isVideoOn });
	});

	socket.on("hand-raise-status", ({ userId, isHandRaised }) => {
		socket.to(socket.data.sessionId).emit("hand-raise-status", { userId, isHandRaised });
	});

	socket.on("disconnect", (reason) => {
		const { sessionId, userId, role } = socket.data;

		if (sessionId && sessions[sessionId]) {
			sessions[sessionId] = sessions[sessionId].filter((participant) => participant.userId !== userId);

			if (role === "mentor" && activeCalls[sessionId]) {
				delete activeCalls[sessionId];
			}

			if (sessions[sessionId].length === 0) {
				delete sessions[sessionId];
			}

			socket.to(sessionId).emit("user-disconnected", { userId });
		}
		console.log(`❌ User disconnected: ${socket.id}, reason: ${reason}`);
	});

	socket.on("reconnect-session", async ({ sessionId, userId, peerId, role }) => {
		try {
			const session = await SessionModel.findById(sessionId);
			if (!session) {
				socket.emit("error", { message: "Session does not exist" });
				return;
			}

			if (!sessions[sessionId]) {
				socket.emit("error", { message: "Session is no longer active" });
				return;
			}

			sessions[sessionId].push({
				userId,
				peerId,
				socketId: socket.id,
				role,
				isApproved: role === "mentor" ? true : false,
			});

			socket.data.sessionId = sessionId;
			socket.data.userId = userId;
			socket.data.role = role;

			if (role === "mentor" && !activeCalls[sessionId]) {
				activeCalls[sessionId] = socket.id;
			}

			socket.join(sessionId);
			socket.emit("reconnect-success", { sessionId });

			if (role === "user" && sessions[sessionId].find((p) => p.userId === userId)?.isApproved) {
				const mentor = sessions[sessionId].find((p) => p.role === "mentor");
				if (mentor) {
					socket.emit("join-approved", { sessionId, mentorPeerId: mentor.peerId });
				}
			}

			console.log(`User ${userId} reconnected to session ${sessionId}`);
		} catch (error) {
			socket.emit("error", { message: "Failed to reconnect" });
		}
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

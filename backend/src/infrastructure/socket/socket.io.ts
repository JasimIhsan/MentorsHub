import { Server, Socket } from "socket.io";
import { Model } from "mongoose";
import { ISessionDocument } from "../database/models/session/session.model";

interface SessionParticipant {
	userId: string;
	peerId: string;
	socketId: string;
	role: "mentor" | "user";
	isApproved?: boolean;
	name: string;
	avatar?: string;
}

export interface Sessions {
	[sessionId: string]: SessionParticipant[];
}

interface ActiveCalls {
	[sessionId: string]: string;
}

// Track all connected users
interface ConnectedUsers {
	[userId: string]: string; // userId -> socketId
}

export const sessions: Sessions = {};
export const activeCalls: ActiveCalls = {};
export const connectedUsers: ConnectedUsers = {};

export const findUserSocket = (recipientId: string): string | undefined => {
	// Check connected users first
	if (connectedUsers[recipientId]) {
		return connectedUsers[recipientId];
	}
	// Fallback to session participants
	for (const sessionId in sessions) {
		const participant = sessions[sessionId].find((p) => p.userId === recipientId);
		if (participant) return participant.socketId;
	}
	return undefined;
};

const initializeSocket = (io: Server, SessionModel: Model<ISessionDocument>) => {
	io.on("connection", (socket: Socket) => {
		console.log(`✅ User connected: ${socket.id}`);

		// Register user on connection
		socket.on("register-user", (userId: string) => {
			if (userId) {
				connectedUsers[userId] = socket.id;
				console.log(`User ${userId} registered with socket ${socket.id}`);
			}
		});

		socket.on("join-session", async ({ sessionId, userId, peerId, role, name, avatar }) => {
			console.log(`join-session: sessionId=${sessionId}, userId=${userId}, role=${role}`);
			try {
				const session = await SessionModel.findById(sessionId);
				if (!session) return socket.emit("error", { message: "Session not found" });

				if (!["upcoming", "ongoing"].includes(session.status)) {
					return socket.emit("error", { message: "Session is not available or not paid" });
				}

				sessions[sessionId] = sessions[sessionId] || [];
				const existingIndex = sessions[sessionId].findIndex((p) => p.userId === userId);
				const participantData: SessionParticipant = { userId, peerId, socketId: socket.id, role, name, avatar };

				if (role === "mentor") {
					if (session.mentorId.toString() !== userId) {
						return socket.emit("error", { message: "Not authorized as mentor" });
					}
					participantData.isApproved = true;
					if (existingIndex !== -1) sessions[sessionId][existingIndex] = participantData;
					else sessions[sessionId].push(participantData);
					activeCalls[sessionId] = socket.id;
					socket.join(sessionId);
					Object.assign(socket.data, { sessionId, userId, role });
					console.log(`👨‍🏫 Mentor joined: ${userId}`);
				} else {
					participantData.isApproved = false;
					if (existingIndex !== -1) sessions[sessionId][existingIndex] = participantData;
					else sessions[sessionId].push(participantData);
					Object.assign(socket.data, { sessionId, userId, role });
					const mentor = sessions[sessionId].find((p) => p.role === "mentor");
					if (mentor) {
						io.to(mentor.socketId).emit("join-request", { userId, sessionId, peerId, name, avatar });
					} else {
						socket.emit("error", { message: "Mentor not available" });
					}
					console.log(`🧑 User requested to join: ${userId}`);
				}
			} catch (err: any) {
				console.error(err.message);
				socket.emit("error", { message: "Join session failed" });
			}
		});

		socket.on("approve-join", ({ userId, sessionId, approve, mentorPeerId }) => {
			if (socket.data.role !== "mentor") {
				return socket.emit("error", { message: "Only mentors can approve joins" });
			}
			const participants = sessions[sessionId];
			const user = participants?.find((p) => p.userId === userId);
			if (!user) return socket.emit("error", { message: "User not found" });
			if (approve) {
				user.isApproved = true;
				io.to(user.socketId).emit("join-approved", { sessionId, mentorPeerId });
				io.to(sessionId).emit("user-joined", { peerId: user.peerId, name: user.name, avatar: user.avatar });
				const userSocket = io.sockets.sockets.get(user.socketId);
				userSocket?.join(sessionId);
				console.log(`✅ User approved: ${userId}`);
			} else {
				io.to(user.socketId).emit("join-rejected", { message: "Mentor rejected your request" });
				sessions[sessionId] = participants.filter((p) => p.userId !== userId);
				console.log(`❌ User rejected: ${userId}`);
			}
		});

		socket.on("mute-status", ({ userId, isMuted }) => {
			socket.to(socket.data.sessionId).emit("mute-status", { userId, isMuted });
		});

		socket.on("video-status", ({ registrarId, status }) => {
			socket.to(socket.data.sessionId).emit("video-status", { registrarId, status });
		});

		socket.on("hand-raise-status", ({ userId, isHandRaised }) => {
			socket.to(socket.data.sessionId).emit("hand-raise-status", { userId, isHandRaised });
		});

		socket.on("reconnect-session", async ({ sessionId, userId, peerId, role, name, avatar }) => {
			try {
				const session = await SessionModel.findById(sessionId);
				if (!session) return socket.emit("error", { message: "Session not found" });
				if (!sessions[sessionId]) return socket.emit("error", { message: "Session not active" });
				const existingIndex = sessions[sessionId].findIndex((p) => p.userId === userId);
				const participantData: SessionParticipant = {
					userId,
					peerId,
					socketId: socket.id,
					role,
					isApproved: role === "mentor" ? true : false,
					name,
					avatar,
				};
				if (existingIndex !== -1) sessions[sessionId][existingIndex] = participantData;
				else sessions[sessionId].push(participantData);
				Object.assign(socket.data, { sessionId, userId, role });
				socket.join(sessionId);
				if (role === "mentor") {
					activeCalls[sessionId] = socket.id;
					const users = sessions[sessionId].filter((p) => p.role === "user" && p.isApproved);
					for (const user of users) {
						io.to(user.socketId).emit("join-approved", { sessionId, mentorPeerId: peerId });
					}
				} else {
					const mentor = sessions[sessionId].find((p) => p.role === "mentor");
					if (mentor && participantData.isApproved) {
						socket.emit("join-approved", { sessionId, mentorPeerId: mentor.peerId });
					}
				}
				socket.emit("reconnect-success", { sessionId });
				console.log(`🔄 User reconnected: ${userId}`);
			} catch (error: any) {
				socket.emit("error", { message: "Reconnect failed" });
			}
		});

		socket.on("disconnect", (reason) => {
			const { sessionId, userId, role } = socket.data;
			// Remove from connectedUsers
			for (const uid in connectedUsers) {
				if (connectedUsers[uid] === socket.id) {
					delete connectedUsers[uid];
					console.log(`User ${uid} disconnected from connectedUsers`);
					break;
				}
			}
			// Handle session disconnection
			if (!sessionId || !userId) return;
			const participants = sessions[sessionId];
			if (!participants) return;
			const user = participants.find((p) => p.userId === userId);
			sessions[sessionId] = participants.filter((p) => p.userId !== userId);
			if (role === "mentor") delete activeCalls[sessionId];
			if (sessions[sessionId].length === 0) delete sessions[sessionId];
			socket.to(sessionId).emit("user-disconnected", { name: user?.name, avatar: user?.avatar });
			console.log(`❌ Disconnected: ${userId}, reason: ${reason}`);
		});

		socket.on("send-notification", ({ recipientId, notification }) => {
			const recipientSocketId = findUserSocket(recipientId);
			if (recipientSocketId) {
				io.to(recipientSocketId).emit("receive-notification", notification);
				console.log(`Notification sent to user ${recipientId} at socket ${recipientSocketId}`);
			} else {
				console.log(`User ${recipientId} offline. Notification saved to DB.`);
			}
		});

		socket.on("error", (error: Error) => {
			console.error(`Socket error for ${socket.id}: ${error.message}`);
		});

		socket.on("connect_error", (error: Error) => {
			console.error(`Connection error for ${socket.id}: ${error.message}`);
		});
	});
};

export default initializeSocket;

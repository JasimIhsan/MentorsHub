import { Server, Socket } from "socket.io";
import { Model } from "mongoose";
import { ISessionDocument } from "../../database/models/session/session.model";
import { markMessageAsReadUsecase, sendMessageUsecase } from "../../../application/usecases/text-message/composer";
import { deleteMessageHandler } from "./socket/delete.message.handler";
import { registerMessageReadHandlers } from "./socket/update.readby.handler";
import { getMessageUnreadCountHandler } from "./socket/get.message.unread.count.handler";
import { CommonStringMessage } from "../../../shared/constants/string.messages";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { SessionStatusEnum } from "../../../application/interfaces/enums/session.status.enums";

interface SessionParticipant {
	userId: string;
	peerId: string;
	socketId: string;
	role: RoleEnum.MENTOR | RoleEnum.USER;
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
				const wasOffline = !connectedUsers[userId];
				connectedUsers[userId] = socket.id;
				socket.data = socket.data || {};
				socket.data.userId = userId;
				console.log(`User ${userId} registered with socket ${socket.id}`);

				// Broadcast online status to all connected users
				if (wasOffline) {
					io.emit("user.status-update", { userId, status: "online" }); // Broadcast to all clients
				}
			}
		});

		socket.on("get-online-users", () => {
			const onlineUsers = Object.keys(connectedUsers).map((userId) => ({
				userId,
				status: "online",
			}));
			socket.emit("online-users", onlineUsers); // Send back to the requesting client
		});

		socket.on("join-session", async ({ sessionId, userId, peerId, role, name, avatar }) => {
			console.log(`join-session: sessionId=${sessionId}, userId=${userId}, role=${role}`);
			try {
				const session = await SessionModel.findById(sessionId);
				if (!session) return socket.emit("error", { message: CommonStringMessage.SESSION_NOT_FOUND });

				if (![SessionStatusEnum.UPCOMING, SessionStatusEnum.ONGOING].includes(session.status)) {
					return socket.emit("error", { message: "Session is not available or not paid" });
				}

				sessions[sessionId] = sessions[sessionId] || [];
				const existingIndex = sessions[sessionId].findIndex((p) => p.userId === userId);
				const participantData: SessionParticipant = { userId, peerId, socketId: socket.id, role, name, avatar };

				if (role === RoleEnum.MENTOR) {
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
					const mentor = sessions[sessionId].find((p) => p.role === RoleEnum.MENTOR);
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
			if (socket.data.role !== RoleEnum.MENTOR) {
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
			const isVideoOn = typeof status === "boolean" ? status : true;
			socket.to(socket.data.sessionId).emit("video-status", { registrarId, isVideoOn });
		});

		socket.on("hand-raise-status", ({ userId, isHandRaised }) => {
			socket.to(socket.data.sessionId).emit("hand-raise-status", { userId, isHandRaised });
		});

		socket.on("reconnect-session", async ({ sessionId, userId, peerId, role, name, avatar }) => {
			try {
				const session = await SessionModel.findById(sessionId);
				if (!session) return socket.emit("error", { message: CommonStringMessage.SESSION_NOT_FOUND });
				if (!sessions[sessionId]) return socket.emit("error", { message: "Session not active" });
				const existingIndex = sessions[sessionId].findIndex((p) => p.userId === userId);
				const participantData: SessionParticipant = {
					userId,
					peerId,
					socketId: socket.id,
					role,
					isApproved: role === RoleEnum.MENTOR ? true : false,
					name,
					avatar,
				};
				if (existingIndex !== -1) sessions[sessionId][existingIndex] = participantData;
				else sessions[sessionId].push(participantData);
				Object.assign(socket.data, { sessionId, userId, role });
				socket.join(sessionId);
				if (role === RoleEnum.MENTOR) {
					activeCalls[sessionId] = socket.id;
					const users = sessions[sessionId].filter((p) => p.role === RoleEnum.USER && p.isApproved);
					for (const user of users) {
						io.to(user.socketId).emit("join-approved", { sessionId, mentorPeerId: peerId });
					}
				} else {
					const mentor = sessions[sessionId].find((p) => p.role === RoleEnum.MENTOR);
					if (mentor && participantData.isApproved) {
						socket.emit("join-approved", { sessionId, mentorPeerId: mentor.peerId });
					}
				}
				socket.emit("reconnect-success", { sessionId });
				console.log(`🔄 User reconnected: ${userId}`);
			} catch (error) {
				console.log("Error from reconnect-session : ", error);
				socket.emit("error", { message: "Reconnect failed" });
			}
		});

		socket.on("disconnect", (reason) => {
			const { sessionId, userId, role } = socket.data;

			// Handle user disconnection from connectedUsers and onlineUsers
			if (userId && connectedUsers[userId]) {
				delete connectedUsers[userId];
				console.log(`User ${userId} disconnected from connectedUsers`);
				io.emit("user.status-update", { userId, status: "offline" });
				// ... session disconnection logic
			}
			// Handle session disconnection
			if (!sessionId || !userId) return;
			const participants = sessions[sessionId];
			if (!participants) return;
			const user = participants.find((p) => p.userId === userId);
			sessions[sessionId] = participants.filter((p) => p.userId !== userId);
			if (role === RoleEnum.MENTOR) delete activeCalls[sessionId];
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

		// ============================================== MESSAGE LOGIC ============================================== //

		// Join chat room
		socket.on("join-chat-room", ({ chatId }) => {
			socket.join(`chat_${chatId}`);
			console.log(`✅ User joined chat room chat_${chatId}`);
			socket.emit("joined-chat-room", { chatId }); // Confirm room joining
		});
		// 1. Handle incoming message
		socket.on("send-message", async (data) => {
			const { chatId, senderId, receiverId, content, type = "text", fileUrl } = data;

			try {
				// 1. Call use case to handle message logic
				const message = await sendMessageUsecase.execute({
					chatId,
					sender: senderId,
					receiver: receiverId,
					content,
					type,
					fileUrl,
				});

				console.log(`✅ Message sent : ${message}` );

				// 2. Emit the message to all users in the chat room
				io.to(`chat_${chatId}`).emit("receive-message", message);
			} catch (err) {
				console.error("send-message error:", err);
				socket.emit("error", { message: "Failed to send message" });
			}
		});

		// 2. Mark as read
		socket.on("mark-as-read", async ({ chatId, userId }) => {
			try {
				await markMessageAsReadUsecase.execute(chatId, userId);

				// Optionally notify sender(s) that messages were read
				io.to(chatId).emit("message-read", { chatId, userId });
			} catch (err) {
				console.error("mark-as-read error:", err);
			}
		});

		deleteMessageHandler(io, socket);
		registerMessageReadHandlers(io, socket);
		getMessageUnreadCountHandler(io, socket);
	});
};

export default initializeSocket;

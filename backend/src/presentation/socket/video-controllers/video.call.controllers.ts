import { Server, Socket } from "socket.io";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { SessionStatusEnum } from "../../../application/interfaces/enums/session.status.enums";
import { CommonStringMessage } from "../../../shared/constants/string.messages";
import { VideoParticipant, videoRooms } from "../../../infrastructure/socket/context";
import { sessionRepository } from "../../../infrastructure/composer";

export const registerVideoCallHandlers = (io: Server, socket: Socket) => {
	socket.on("join-session", async ({ sessionId, userId, peerId, role, name, avatar }) => {
		console.log(`🎧 join-session: sessionId=${sessionId}, userId=${userId}, role=${role}`);

		try {
			const session = await sessionRepository.findById(sessionId);
			if (!session) {
				return socket.emit("error", { message: CommonStringMessage.SESSION_NOT_FOUND });
			}

			// ✅ Validate session status
			if (![SessionStatusEnum.UPCOMING, SessionStatusEnum.ONGOING].includes(session.status)) {
				return socket.emit("error", { message: "Session is not available or not paid" });
			}

			// Extract hours and minutes from the start time
			const [hours, minutes] = session.startTime.split(":").map(Number);

			// Build full UTC datetime for session start
			const sessionStartUTC = new Date(session.date);
			sessionStartUTC.setUTCHours(hours, minutes, 0, 0); // keep in UTC

			// Allowed join time = 5 minutes before start
			const joinAllowedTimeUTC = new Date(sessionStartUTC.getTime() - 5 * 60 * 1000);

			const nowUTC = new Date();

			if (nowUTC < joinAllowedTimeUTC) {
				return socket.emit("error", { message: "You can join the session 5 minutes before it starts." });
			}

			// ✅ Setup participant data
			const participants = videoRooms.get(sessionId) || [];
			const existingIndex = participants.findIndex((p) => p.userId === userId);

			const participantData: VideoParticipant = {
				userId,
				peerId,
				socketId: socket.id,
				role,
				name,
				avatar,
				isApproved: role === RoleEnum.MENTOR,
			};

			// ✅ Mentor logic
			if (role === RoleEnum.MENTOR) {
				if (session.mentor.id !== userId) {
					return socket.emit("error", { message: "Not authorized as mentor" });
				}

				if (existingIndex !== -1) {
					participants[existingIndex] = participantData;
				} else {
					participants.push(participantData);
				}

				videoRooms.set(sessionId, participants);
				socket.join(`video_${sessionId}`);
				Object.assign(socket.data, { sessionId, userId, role });

				console.log(`👨‍🏫 Mentor joined: ${userId}`);
				return;
			}

			// ✅ Participant logic
			if (existingIndex !== -1) {
				participants[existingIndex] = participantData;
			} else {
				participants.push(participantData);
			}

			videoRooms.set(sessionId, participants);
			Object.assign(socket.data, { sessionId, userId, role });

			const mentor = participants.find((p) => p.role === RoleEnum.MENTOR);

			if (mentor) {
				io.to(mentor.socketId).emit("join-request", {
					userId,
					sessionId,
					peerId,
					name,
					avatar,
				});
				console.log(`🧑 User requested to join: ${userId}`);
			} else {
				socket.emit("error", { message: "Mentor not available" });
			}
		} catch (err: any) {
			console.error("❌ join-session error:", err.message);
			socket.emit("error", { message: "Join session failed" });
		}
	});

	// ✅ Approve Join Request
	socket.on("approve-join", ({ userId, sessionId, approve, mentorPeerId }) => {
		if (socket.data.role !== RoleEnum.MENTOR) {
			return socket.emit("error", { message: "Only mentors can approve joins" });
		}

		const participants = videoRooms.get(sessionId);
		if (!participants) return socket.emit("error", { message: "Session not active" });

		const user = participants.find((p) => p.userId === userId);
		if (!user) return socket.emit("error", { message: "User not found" });

		if (approve) {
			user.isApproved = true;
			io.to(user.socketId).emit("join-approved", { sessionId, mentorPeerId });
			io.to(`video_${sessionId}`).emit("user-joined", {
				peerId: user.peerId,
				name: user.name,
				avatar: user.avatar,
			});
			const userSocket = io.sockets.sockets.get(user.socketId);
			userSocket?.join(`video_${sessionId}`);
			console.log(`✅ User approved: ${userId}`);
		} else {
			io.to(user.socketId).emit("join-rejected", { message: "Mentor rejected your request" });
			const filtered = participants.filter((p) => p.userId !== userId);
			videoRooms.set(sessionId, filtered);
			console.log(`❌ User rejected: ${userId}`);
		}
	});

	// ✅ Mute Status
	socket.on("mute-status", ({ userId, isMuted }) => {
		socket.to(`video_${socket.data.sessionId}`).emit("mute-status", { userId, isMuted });
	});

	// ✅ Video Status
	socket.on("video-status", ({ registrarId, status }) => {
		const isVideoOn = typeof status === "boolean" ? status : true;
		socket.to(`video_${socket.data.sessionId}`).emit("video-status", { registrarId, isVideoOn });
	});

	// ✅ Hand Raise
	socket.on("hand-raise-status", ({ userId, isHandRaised }) => {
		socket.to(`video_${socket.data.sessionId}`).emit("hand-raise-status", { userId, isHandRaised });
	});

	// ✅ Reconnect Session
	socket.on("reconnect-session", async ({ sessionId, userId, peerId, role, name, avatar }) => {
		try {
			const session = await sessionRepository.findById(sessionId);
			if (!session) return socket.emit("error", { message: CommonStringMessage.SESSION_NOT_FOUND });

			const participants = videoRooms.get(sessionId);
			if (!participants) return socket.emit("error", { message: "Session not active" });

			const existingIndex = participants.findIndex((p) => p.userId === userId);
			const isMentor = role === RoleEnum.MENTOR;

			const participantData: VideoParticipant = {
				userId,
				peerId,
				socketId: socket.id,
				role,
				name,
				avatar,
				isApproved: isMentor ? true : participants[existingIndex]?.isApproved || false,
			};

			if (existingIndex !== -1) participants[existingIndex] = participantData;
			else participants.push(participantData);

			videoRooms.set(sessionId, participants);
			Object.assign(socket.data, { sessionId, userId, role });
			socket.join(`video_${sessionId}`);

			if (isMentor) {
				const users = participants.filter((p) => p.role === RoleEnum.USER && p.isApproved);
				for (const user of users) {
					io.to(user.socketId).emit("join-approved", { sessionId, mentorPeerId: peerId });
				}
			} else {
				const mentor = participants.find((p) => p.role === RoleEnum.MENTOR);
				if (mentor && participantData.isApproved) {
					socket.emit("join-approved", { sessionId, mentorPeerId: mentor.peerId });
				}
			}

			socket.emit("reconnect-success", { sessionId });
			console.log(`🔄 User reconnected: ${userId}`);
		} catch (err) {
			console.log("Error from reconnect-session: ", err);
			socket.emit("error", { message: "Reconnect failed" });
		}
	});

	socket.on("leave-session", () => {
		const { sessionId, userId } = socket.data;
		if (!sessionId || !userId) return;

		const participants = videoRooms.get(sessionId);
		if (!participants) return;

		const user = participants.find((p) => p.userId === userId);
		const updatedParticipants = participants.filter((p) => p.userId !== userId);

		if (updatedParticipants.length === 0) {
			videoRooms.delete(sessionId); // clean up empty room
		} else {
			videoRooms.set(sessionId, updatedParticipants);
		}

		// Remove user from socket room
		socket.leave(`video_${sessionId}`);

		// Notify others in room
		socket.to(`video_${sessionId}`).emit("user-disconnected", {
			name: user?.name,
			avatar: user?.avatar,
			userId: user?.userId,
		});

		console.log(`👋 ${userId} manually left session ${sessionId}`);
	});
};

import { Socket } from "socket.io";
import { RoleEnum } from "../../application/interfaces/enums/role.enum";

// Describes a user connected to any real-time feature (chat, call, etc.)
export interface VideoParticipant {
	userId: string;
	socketId: string;
	peerId: string; // For WebRTC or peer-based features
	role: RoleEnum.MENTOR | RoleEnum.USER;
	name: string;
	avatar?: string;
	isApproved?: boolean; // Used in mentor approval flows
}

export interface ChatParticipant {
	userId: string;
	socketId: string;
	fullName: string;
	avatar?: string;
}

// 👥 Users currently online
export const onlineUsers = new Map<string, Socket>();

// 💬 Chat rooms (sessionId → participants)
export const chatRooms = new Map<string, ChatParticipant[]>();

// 🎥 Video rooms (sessionId → participants)
export const videoRooms = new Map<string, VideoParticipant[]>();

// 👑 Active video call host (sessionId → socketId)
export const activeHosts = new Map<string, string>();

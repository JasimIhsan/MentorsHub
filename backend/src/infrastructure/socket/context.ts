import { Socket } from "socket.io";
import { RoleEnum } from "../../application/interfaces/enums/role.enum";

// Describes a user connected to any real-time feature (chat, call, etc.)
export interface RealtimeParticipant {
	userId: string;
	socketId: string;
	peerId: string; // For WebRTC or peer-based features
	role: RoleEnum.MENTOR | RoleEnum.USER;
	name: string;
	avatar?: string;
	isApproved?: boolean; // Used in mentor approval flows
}

// Map of userId → socketId (for quick lookup)
export const onlineUsers = new Map<string, Socket>();

// Map of sessionId → participants[] (could be for call, chat, etc.)
export const realtimeRooms: Record<string, RealtimeParticipant[]> = {};

// Map of sessionId → hostSocketId (typically the mentor/creator)
export const activeHosts: Record<string, string> = {};

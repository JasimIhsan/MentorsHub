export type SessionStatus = "upcoming" | "completed" | "canceled" | "approved" | "pending" | "rejected" | "expired";

interface BaseSession {
	topic: string;
	sessionType: string;
	sessionFormat: string;
	date: string;
	time: string;
	hours: number;
	message: string;
	status: SessionStatus;
	paymentStatus?: "pending" | "completed" | "failed"; // (can be removed if moved to participant level)
	pricing: "free" | "paid";
	rejectReason?: string;
	paymentId?: string; // (can be removed if moved to participant level)
	totalAmount?: number;
	createdAt: string;
}

interface Person {
	_id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export interface MentorInfo extends Person {}
export interface Mentee extends Person {}

export interface SessionParticipant extends Mentee {
	paymentStatus?: "pending" | "completed" | "failed";
	paymentId?: string;
}

export interface ISessionUserDTO extends BaseSession {
	id: string;
	mentor: MentorInfo;
	userId: string;
}

export interface ISessionMentorDTO extends BaseSession {
	id: string;
	mentor: string;
	participants: SessionParticipant[];
}

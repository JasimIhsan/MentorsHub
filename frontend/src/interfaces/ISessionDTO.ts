export type SessionStatus = "upcoming" | "completed" | "canceled" | "approved" | "pending" | "rejected";

interface BaseSession {
	topic: string;
	sessionType: string;
	sessionFormat: string;
	date: string;
	time: string;
	hours: number;
	message: string;
	status: SessionStatus;
	paymentStatus?: "pending" | "completed" | "failed";
	pricing: "free" | "paid";
	paymentId?: string;
	totalAmount?: number;
	rejectReaseon?: string;
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

export interface ISessionUserDTO extends BaseSession {
	id: string;
	mentor: MentorInfo;
	userId: string;
}

export interface ISessionMentorDTO extends BaseSession {
	id: string;
	mentor: string;
	userId: Mentee;
}

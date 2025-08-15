import { SessionPaymentStatusEnum, SessionStatusEnum } from "./enums/session.status.enum";
import { IRescheduleRequestDTO } from "./reschedule.interface";

export type SessionStatus = "upcoming" | "completed" | "canceled" | "approved" | "pending" | "rejected" | "expired";

interface BaseSession {
	topic: string;
	sessionFormat: string;
	date: string;
	startTime: string;
	endTime: string;
	hours: number;
	message: string;
	status: SessionStatusEnum;
	paymentStatus?: SessionPaymentStatusEnum; // (can be removed if moved to participant level)
	pricing: "free" | "paid";
	rejectReason?: string;
	paymentId?: string; // (can be removed if moved to participant level)
	totalAmount?: number;
	rescheduleRequest?: IRescheduleRequestDTO;
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

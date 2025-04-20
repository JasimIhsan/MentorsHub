export interface MentorInfo {
	_id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export type SessionStatus = "upcoming" | "completed" | "canceled" | "approved" | "pending";

export interface ISessionDTO {
	id: string;
	mentor: MentorInfo;
	userId: string;
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
	createdAt: string;
}

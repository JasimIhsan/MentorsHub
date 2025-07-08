// domain/repositories/session.repository.ts

import { SessionPaymentStatusEnum } from "../../application/interfaces/enums/session.payment.status.enum";
import { SessionStatusEnum } from "../../application/interfaces/enums/session.status.enums";
import { SessionEntity } from "../entities/session.entity";

export interface ISessionRepository {
	// Create a new session
	create(session: SessionEntity): Promise<SessionEntity>;

	// Get a session by its ID
	findById(id: string): Promise<SessionEntity | null>;

	findByIds(ids: string[]): Promise<SessionEntity[]>;

	// Get all sessions that a specific user is part of
	findByUser(
		userId: string,
		options?: {
			page?: number;
			limit?: number;
			search?: string;
			status?: string;
		}
	): Promise<{ sessions: SessionEntity[]; total: number }>;

	// Get all sessions for a specific mentor with filters and pagination
	findByMentor(
		mentorId: string,
		options: {
			status?: SessionStatusEnum;
			filter?: "all" | "free" | "paid" | "today" | "week" | "month";
			page: number;
			limit: number;
		}
	): Promise<{ sessions: SessionEntity[]; total: number }>;

	// Update the status (and optionally reject reason) of a session
	updateStatus(sessionId: string, status: SessionStatusEnum, reason?: string): Promise<SessionEntity>;

	// Mark a user's payment status for a session
	markPayment(sessionId: string, userId: string, paymentStatus: SessionPaymentStatusEnum, paymentId: string, newStatus: SessionStatusEnum): Promise<void>;

	// Get all sessions for a specific mentor (no pagination)
	getAllByMentor(mentorId: string): Promise<SessionEntity[]>;

	// Get sessions that are "about to expire" (pending/approved/upcoming)
	getExpirableSessions(): Promise<SessionEntity[]>;

	// Delete a session by ID (used when expiring it)
	deleteById(sessionId: string): Promise<void>;

	// Get all sessions for a mentor on a specific date
	findByDate(mentorId: string, date: Date): Promise<SessionEntity[]>;
}

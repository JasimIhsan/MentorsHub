
import { SessionPaymentStatusEnum } from "../../application/interfaces/enums/session.payment.status.enum";
import { SessionStatusEnum } from "../../application/interfaces/enums/session.status.enums";
import { SessionEntity } from "../entities/session.entity";

export interface ISessionRepository {
	create(session: SessionEntity): Promise<SessionEntity>;
	findById(id: string): Promise<SessionEntity | null>;
	findByIds(ids: string[]): Promise<SessionEntity[]>;
	findByUser(
		userId: string,
		options?: {
			page?: number;
			limit?: number;
			search?: string;
			status?: string;
		}
	): Promise<{ sessions: SessionEntity[]; total: number }>;
	findByMentor(
		mentorId: string,
		options: {
			status?: SessionStatusEnum;
			filter?: "all" | "free" | "paid" | "today" | "week" | "month";
			page: number;
			limit: number;
		}
	): Promise<{ sessions: SessionEntity[]; total: number }>;
	updateStatus(sessionId: string, status: SessionStatusEnum, reason?: string): Promise<SessionEntity>;
	markPayment(sessionId: string, userId: string, paymentStatus: SessionPaymentStatusEnum, paymentId: string, newStatus: SessionStatusEnum): Promise<void>;
	getAllByMentor(mentorId: string): Promise<SessionEntity[]>;
	getExpirableSessions(): Promise<SessionEntity[]>;
	deleteById(sessionId: string): Promise<void>;
	findByDate(mentorId: string, date: Date): Promise<SessionEntity[]>;
	getWeeklyPerformance(mentorId: string, period: "month" | "sixMonths" | "year"): Promise<{ week: string; sessions: number; revenue: number }[]>;
	findSessionCount(mentorId: string, status: SessionStatusEnum): Promise<number>;
	findRevenueByMentor(mentorId: string): Promise<number>;
}

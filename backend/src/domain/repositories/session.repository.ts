import { ISessionMentorDTO, ISessionUserDTO } from "../../application/dtos/session.dto";
import { ISessionDocument } from "../../infrastructure/database/models/session/session.model";
import { SessionEntity } from "../entities/session.entity";

export interface ISessionRepository {
	getSessionById(sessionId: string): Promise<SessionEntity | null>;
	findSessionsByIds(sessionIds: string[]): Promise<SessionEntity[]>;
	createSession(session: SessionEntity): Promise<SessionEntity>;
	getSessionsByUser(userId: string): Promise<ISessionUserDTO[]>;
	getSessionByMentor(
		mentorId: string,
		queryParams: {
			status?: string;
			filterOption?: "all" | "free" | "paid" | "today" | "week" | "month";
			page: number;
			limit: number;
		}
	): Promise<{ sessions: ISessionMentorDTO[]; total: number }>;
	updateSessionStatus(sessionId: string, status: string, rejectReason?: string): Promise<SessionEntity>;
	paySession(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void>;
	getSessions(mentorId: string): Promise<ISessionMentorDTO[]>;
	expireSession(sessionId: string): Promise<void>;
	getSessionToExpire(): Promise<ISessionDocument[]>;
	getSessionByDate(mentorId: string, date: Date): Promise<SessionEntity[] | null>;
}

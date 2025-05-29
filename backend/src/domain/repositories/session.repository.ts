import { ISessionMentorDTO, ISessionUserDTO } from "../../application/dtos/session.dto";
import { ISessionDocument } from "../../infrastructure/database/models/session/session.model";
import { SessionEntity } from "../entities/session.entity";

export interface ISessionRepository {
	createSession(session: SessionEntity): Promise<SessionEntity>;
	getSessionsByUser(userId: string): Promise<ISessionUserDTO[]>;
	getSessionRequestByMentor(
		mentorId: string,
		queryParams: {
			status?: string;
			dateRange?: "all" | "free" | "paid" | "today" | "week";
			page: number;
			limit: number;
		}
	): Promise<{ requests: ISessionMentorDTO[]; total: number }>;
	updateRequestStatus(sessionId: string, status: string, rejectReason?: string): Promise<void>;
	paySession(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void>;
	getSessions(mentorId: string): Promise<ISessionMentorDTO[]>;
	expireSession(sessionId: string): Promise<void>;
	getSessionToExpire(): Promise<ISessionDocument[]>;
	getSessionByDate(mentorId: string, date: Date): Promise<SessionEntity[] | null>;
}

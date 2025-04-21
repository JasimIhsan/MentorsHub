import { ISessionMentorDTO, ISessionUserDTO } from "../../application/dtos/session.dto";
import { SessionEntity } from "../entities/session.entity";

export interface ISessionRepository {
	createSession(session: SessionEntity): Promise<SessionEntity>;
	fetchSessionsByUser(userId: string): Promise<ISessionUserDTO[]>;
	fetchSessionRequestByMentor(mentorId: string): Promise<ISessionMentorDTO[]>;
	updateRequestStatus(sessionId: string, status: string): Promise<void>;
}

import { ISessionDTO } from "../../application/dtos/session.dto";
import { SessionEntity } from "../entities/session.entity";

export interface ISessionRepository {
	createSession(session: SessionEntity): Promise<SessionEntity>;
	fetchSessionsByUser(userId: string): Promise<ISessionDTO[]>;
	fetchSessionRequestByMentor(mentorId: string): Promise<any[]>;
}

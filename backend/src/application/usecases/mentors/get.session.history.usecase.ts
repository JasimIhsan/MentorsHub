import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ISessionMentorDTO } from "../../dtos/session.dto";
import { IGetSessionHistoryUsecase } from "../../interfaces/mentors/mentors.interface";

export class GetSessionHistoryUsecase implements IGetSessionHistoryUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string, queryParams: { page: number; limit: number; status: string }): Promise<{ sessions: ISessionMentorDTO[]; total: number }> {
		const sessions = await this.sessionRepo.getSessionByMentor(mentorId, queryParams);
		return { sessions: sessions.sessions, total: sessions.total };
	}
}

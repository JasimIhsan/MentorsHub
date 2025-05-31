import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ISessionMentorDTO } from "../../dtos/session.dto";
import { IGetSessionRequestsUseCase } from "../../interfaces/mentors/mentors.interface";

interface QueryParams {
	status?: string;
	pricing?: string;
	filterOption?: "today" | "week";
	searchQuery?: string;
	page: number;
	limit: number;
}

export class GetSessionRequests implements IGetSessionRequestsUseCase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string, queryParams: QueryParams): Promise<{ requests: ISessionMentorDTO[]; total: number }> {
		const sessions = await this.sessionRepo.getSessionByMentor(mentorId, queryParams);
		return { requests: sessions.sessions, total: sessions.total };
	}
}

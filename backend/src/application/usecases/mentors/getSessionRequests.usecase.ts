import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ISessionMentorDTO } from "../../dtos/session.dto";
import { IGetSessionRequests } from "../../interfaces/mentors/mentors.interface";

interface QueryParams {
	status?: string;
	pricing?: string;
	dateRange?: "today" | "week";
	searchQuery?: string;
	page: number;
	limit: number;
}

export class GetSessionRequests implements IGetSessionRequests {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string, queryParams: QueryParams): Promise<{ requests: ISessionMentorDTO[]; total: number }> {
		return await this.sessionRepo.getSessionRequestByMentor(mentorId, queryParams);
	}
}

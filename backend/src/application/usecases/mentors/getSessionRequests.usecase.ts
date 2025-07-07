import { PricingType, SessionEntity, SessionStatus } from "../../../domain/entities/session.entity";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ISessionMentorDTO, mapToMentorSessionDTO } from "../../dtos/session.dto";
import { IGetSessionRequestsUseCase } from "../../interfaces/mentors/mentors.interface";

interface QueryParams {
	status?: SessionStatus;
	pricing?: PricingType;
	filterOption?: "free" | "paid" | "today" | "week" | "all" | "month";
	searchQuery?: string;
	page: number;
	limit: number;
}

export class GetSessionRequests implements IGetSessionRequestsUseCase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string, queryParams: QueryParams): Promise<{ requests: ISessionMentorDTO[]; total: number }> {
		const sessions = await this.sessionRepo.findByMentor(mentorId, queryParams);
		return { requests: sessions.sessions.map(mapToMentorSessionDTO), total: sessions.total };
	}
}

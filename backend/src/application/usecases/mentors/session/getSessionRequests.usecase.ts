import { PricingType } from "../../../../domain/entities/session.entity";
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { ISessionMentorDTO, mapToMentorSessionDTO } from "../../../dtos/session.dto";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { IGetSessionRequestsUseCase } from "../../../interfaces/mentors/mentors.interface";

interface QueryParams {
	status?: SessionStatusEnum;
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
		return { requests: sessions.sessions.map((session) => mapToMentorSessionDTO(session)), total: sessions.total };
	}
}

import { SessionStatus } from "../../../domain/entities/session.entity";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { mapToMentorSessionDTO } from "../../dtos/session.dto";
import { IGetUpcomingSessionMentorUsecase } from "../../interfaces/mentors/mentors.interface";

interface QueryParams {
	status?: SessionStatus;
	filterOption?: "all" | "free" | "paid" | "today" | "week" | "month";
	page: number;
	limit: number;
}

export class GetUpcomingSessionMentorUsecase implements IGetUpcomingSessionMentorUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string, queryParams: QueryParams) {
		const sessions = await this.sessionRepo.findByMentor(mentorId, queryParams);

		const now = new Date();
		const upcoming = sessions.sessions
			.filter((session) => {
				const sessionDate = new Date(session.date);
				const [hours, minutes] = session.time.split(":").map(Number);
				sessionDate.setHours(hours, minutes, 0, 0);
				return session.status === "upcoming" && sessionDate > now;
			})
			.sort((sessionA, sessionB) => new Date(sessionA.date).getTime() - new Date(sessionB.date).getTime());

		return { sessions: upcoming.map(mapToMentorSessionDTO), total: sessions.total };
	}
}

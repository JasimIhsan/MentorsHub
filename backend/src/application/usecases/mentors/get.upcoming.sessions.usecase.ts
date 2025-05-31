import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IGetUpcomingSessionMentorUsecase } from "../../interfaces/mentors/mentors.interface";

export class GetUpcomingSessionMentorUsecase implements IGetUpcomingSessionMentorUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(
		mentorId: string,
		queryParams: {
			status?: string;
			filterOption?: "all" | "free" | "paid" | "today" | "week" | "month";
			page: number;
			limit: number;
		}
	) {
		const sessions = await this.sessionRepo.getSessionByMentor(mentorId, queryParams);

		const now = new Date();
		const upcoming = sessions.sessions
			.filter((session) => {
				const sessionDate = new Date(session.date);
				const [hours, minutes] = session.time.split(":").map(Number);
				sessionDate.setHours(hours, minutes, 0, 0);
				return session.status === "upcoming" && sessionDate > now;
			})
			.sort((sessionA, sessionB) => new Date(sessionA.date).getTime() - new Date(sessionB.date).getTime());

		return { sessions: upcoming, total: sessions.total };
	}
}

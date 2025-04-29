import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { IFetchUpcomingSessionMentorUsecase } from "../../interfaces/mentors/mentors.interface";

export class FetchUpcomingSessionMentorUsecase implements IFetchUpcomingSessionMentorUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string) {
		const sessions = await this.sessionRepo.fetchSessions(mentorId);
		const now = new Date();
		const upcoming = sessions.filter((session) => {
			const sessionDateTime = new Date(`${session.date}T${session.time}`);
			return session.status === "upcoming" && sessionDateTime > now;
		});
		return upcoming;
	}
}

import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { IFetchUpcomingSessionMentorUsecase } from "../../interfaces/mentors/mentors.interface";

export class FetchUpcomingSessionMentorUsecase implements IFetchUpcomingSessionMentorUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string) {
		const sessions = await this.sessionRepo.fetchSessions(mentorId);
		return sessions.filter((session) => session.status === "upcoming");
	}
}

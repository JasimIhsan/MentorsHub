import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { IGetUpcomingSessionMentorUsecase } from "../../interfaces/mentors/mentors.interface";

export class GetUpcomingSessionMentorUsecase implements IGetUpcomingSessionMentorUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string) {
		const sessions = await this.sessionRepo.getSessions(mentorId);
		console.log('sessions: ', sessions);
		const now = new Date();
		const upcoming = sessions.filter((session) => {
			const sessionDateTime = new Date(`${session.date}T${session.time}`);
			return session.status === "upcoming" && sessionDateTime > now;
		});
		return upcoming;
	}
}

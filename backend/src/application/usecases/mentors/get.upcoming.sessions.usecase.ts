import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { IGetUpcomingSessionMentorUsecase } from "../../interfaces/mentors/mentors.interface";

export class GetUpcomingSessionMentorUsecase implements IGetUpcomingSessionMentorUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string) {
		const sessions = await this.sessionRepo.getSessions(mentorId);
		const now = new Date();
		const upcoming = sessions.filter((session) => {
			const sessionDate = new Date(session.date);
			const [hours, minutes] = session.time.split(":").map(Number);
			sessionDate.setHours(hours, minutes, 0, 0);
			return session.status === "upcoming" && sessionDate > now;
		});
		return upcoming;
	}
}

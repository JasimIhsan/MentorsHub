import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { IFetchSessionMentorUsecase } from "../../interfaces/mentors/mentors.interface";

export class FetchSessionMentorUsecase implements IFetchSessionMentorUsecase{
	constructor(private sessionRepo: ISessionRepository) {}

	execute(mentorId: string) {
		return this.sessionRepo.fetchSessions(mentorId);
	}
}
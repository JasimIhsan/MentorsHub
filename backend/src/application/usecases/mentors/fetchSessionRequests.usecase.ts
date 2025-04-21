import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { ISessionMentorDTO } from "../../dtos/session.dto";
import { IFetchSessionRequests } from "../../interfaces/mentors/mentors.interface";

export class FetchSessionRequests implements IFetchSessionRequests {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string): Promise<ISessionMentorDTO[]> {
		const requests = await this.sessionRepo.fetchSessionRequestByMentor(mentorId);
		return requests;
	}
}

import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ISessionMentorDTO } from "../../dtos/session.dto";
import { IGetSessionRequests } from "../../interfaces/mentors/mentors.interface";

export class GetSessionRequests implements IGetSessionRequests {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string): Promise<ISessionMentorDTO[]> {
		const requests = await this.sessionRepo.getSessionRequestByMentor(mentorId);
		return requests;
	}
}

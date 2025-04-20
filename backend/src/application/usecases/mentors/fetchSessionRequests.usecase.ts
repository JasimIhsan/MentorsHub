import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { ISessionDTO } from "../../dtos/session.dto";

export class FetchSessionRequests {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string): Promise<ISessionDTO[]> {
		return await this.sessionRepo.fetchSessionRequestByMentor(mentorId);
	}
}
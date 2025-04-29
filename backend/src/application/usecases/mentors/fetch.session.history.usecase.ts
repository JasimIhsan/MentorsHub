import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { IFetchSessionHistoryUsecase } from "../../interfaces/mentors/mentors.interface";

export class FetchSessionHistoryUsecase implements IFetchSessionHistoryUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string){
		console.log('mentorId: ', mentorId);
		const sessions = await this.sessionRepo.fetchSessions(mentorId);
		const res = sessions.filter((session) => {
			return session.status === "completed" || session.status === "canceled" || session.status === "rejected";
		})
		console.log(`res : `, res);
		return res;
	}
}
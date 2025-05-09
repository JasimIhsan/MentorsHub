import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IGetSessionHistoryUsecase } from "../../interfaces/mentors/mentors.interface";

export class GetSessionHistoryUsecase implements IGetSessionHistoryUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string) {
		const sessions = await this.sessionRepo.getSessions(mentorId);
		const res = sessions.filter((session) => {
			return session.status === "completed" || session.status === "canceled" || session.status === "expired";
		});
		return res;
	}
}

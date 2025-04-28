import { ISessionRepository } from "../../../../domain/dbrepository/session.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IFetchSessionsByUserUseCase } from "../../../interfaces/session";

export class FetchSessionsByUserUseCase implements IFetchSessionsByUserUseCase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(userId: string) {
		if (!userId) throw new Error(CommonStringMessage.USER_NOT_FOUND);
		const sessions = await this.sessionRepo.fetchSessionsByUser(userId);
		console.log('sessions: ', sessions);
		
		return sessions;
	}
}

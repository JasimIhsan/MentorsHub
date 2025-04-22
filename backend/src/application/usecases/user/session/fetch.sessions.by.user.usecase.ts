import { ISessionRepository } from "../../../../domain/dbrepository/session.repository";
import { IFetchSessionsByUserUseCase } from "../../../interfaces/session";

export class FetchSessionsByUserUseCase implements IFetchSessionsByUserUseCase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(userId: string) {
		if (!userId) throw new Error("User not found");
		const sessions = await this.sessionRepo.fetchSessionsByUser(userId);
		console.log('sessions: ', sessions);
		
		return sessions;
	}
}

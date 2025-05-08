import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IGetSessionsByUserUseCase } from "../../../interfaces/session";

export class GetSessionsByUserUseCase implements IGetSessionsByUserUseCase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(userId: string) {
		if (!userId) throw new Error(CommonStringMessage.USER_NOT_FOUND);
		const sessions = await this.sessionRepo.getSessionsByUser(userId);
		return sessions;
	}
}

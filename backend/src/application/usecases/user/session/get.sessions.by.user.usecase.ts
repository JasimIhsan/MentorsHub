// application/use-cases/session/get-sessions-by-user.usecase.ts

import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { mapToUserSessionDTO } from "../../../dtos/session.dto";
import { IGetSessionsByUserUseCase } from "../../../interfaces/session";

export class GetSessionsByUserUseCase implements IGetSessionsByUserUseCase {
	constructor(private readonly sessionRepo: ISessionRepository) {}

	async execute(userId: string) {
		if (!userId) {
			throw new Error(CommonStringMessage.USER_NOT_FOUND);
		}

		const sessions = await this.sessionRepo.findByUser(userId);
		return sessions.map((session) => mapToUserSessionDTO(session, userId));
	}
}

// application/use-cases/session/get-sessions-by-user.usecase.ts

import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { ISessionUserDTO, mapToUserSessionDTO } from "../../../dtos/session.dto";
import { IGetSessionsByUserUseCase } from "../../../interfaces/session";

export class GetSessionsByUserUseCase implements IGetSessionsByUserUseCase {
	constructor(private readonly sessionRepo: ISessionRepository) {}

	async execute(
		userId: string,
		options?: {
			page?: number;
			limit?: number;
			search?: string;
			status?: string;
		},
	): Promise<{ sessions: ISessionUserDTO[]; total: number }> {
		if (!userId) {
			throw new Error(CommonStringMessage.USER_NOT_FOUND);
		}

		const { page = 1, limit = 10, search = "", status = "" } = options || {};

		const { sessions, total } = await this.sessionRepo.findByUser(userId, {
			page,
			limit,
			search,
			status,
		});

		return { sessions: sessions.map((session) => mapToUserSessionDTO(session, userId)), total };
	}
}

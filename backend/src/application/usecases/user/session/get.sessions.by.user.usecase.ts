// application/use-cases/session/get-sessions-by-user.usecase.ts

import { RescheduleRequestEntity } from "../../../../domain/entities/reschedule.request.entity";
import { IRescheduleRequestRepository } from "../../../../domain/repositories/reschedule.request.repository";
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { ISessionUserDTO, mapToUserSessionDTO } from "../../../dtos/session.dto";
import { IGetSessionsByUserUseCase } from "../../../interfaces/usecases/session";

export class GetSessionsByUserUseCase implements IGetSessionsByUserUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly rescheduleRequestRepo: IRescheduleRequestRepository) {}

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

		const sessionIds = sessions.map((session) => session.id);

		const requests = await this.rescheduleRequestRepo.findBySessionIds(sessionIds);

		const requestMap = new Map<string, RescheduleRequestEntity>();
		for (const req of requests) {
			requestMap.set(req.sessionId, req);
		}

		const sessionDtos = sessions.map((session) => {
			const request = requestMap.get(session.id);
			return mapToUserSessionDTO(session, userId, request);
		});

		return { sessions: sessionDtos, total };
	}
}

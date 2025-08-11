import { RescheduleRequestEntity } from "../../../domain/entities/reschedule.request.entity";
import { IRescheduleRequestRepository } from "../../../domain/repositories/reschedule.request.repository";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ISessionMentorDTO, mapToMentorSessionDTO } from "../../dtos/session.dto";
import { RescheduleStatusEnum } from "../../interfaces/enums/reschedule.status.enum";
import { IGetSessionRescheduleRequestsByMentorUseCase } from "../../interfaces/reschedule.request";

export class GetSessionRescheduleRequestsByMentorUseCase implements IGetSessionRescheduleRequestsByMentorUseCase {
	constructor(private readonly rescheduleRequestRepo: IRescheduleRequestRepository, private readonly sessionRepo: ISessionRepository) {}

	async execute(mentorId: string, filters: { page: number; limit: number; status?: RescheduleStatusEnum }): Promise<{ sessions: ISessionMentorDTO[]; total: number }> {
		const requests = await this.rescheduleRequestRepo.findByMentorId(mentorId, filters);
		if (!requests.length) return { sessions: [], total: 0 };
		const requestByUser = requests.filter((r) => r.initiatedBy !== mentorId);

		const sessionIds = requestByUser.map((request) => request.sessionId);

		const sessions = await this.sessionRepo.findByIds(sessionIds);

		const requestMap = new Map<string, RescheduleRequestEntity>();

		for (const req of requestByUser) {
			requestMap.set(req.sessionId, req);
		}

		const sessionDtos = sessions.map((session) => {
			const request = requestMap.get(session.id);
			return mapToMentorSessionDTO(session, request);
		});

		return { sessions: sessionDtos, total: requestByUser.length };
	}
}

import { RescheduleRequestEntity } from "../../../../domain/entities/reschedule.request.entity";
import { IRescheduleRequestRepository } from "../../../../domain/repositories/reschedule.request.repository";
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { mapToMentorSessionDTO } from "../../../dtos/session.dto";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { IGetUpcomingSessionMentorUsecase } from "../../../interfaces/usecases/mentors/mentors.interface";

interface QueryParams {
	status?: SessionStatusEnum;
	filterOption?: "all" | "free" | "paid" | "today" | "week" | "month";
	page: number;
	limit: number;
}

export class GetUpcomingSessionMentorUsecase implements IGetUpcomingSessionMentorUsecase {
	constructor(private sessionRepo: ISessionRepository, private rescheduleRequestRepo: IRescheduleRequestRepository) {}

	async execute(mentorId: string, queryParams: QueryParams) {
		const sessions = await this.sessionRepo.findByMentor(mentorId, queryParams);

		const now = new Date();
		const upcoming = sessions.sessions
			.filter((session) => {
				const sessionDate = new Date(session.date);
				const [hours, minutes] = session.startTime.split(":").map(Number);
				sessionDate.setHours(hours, minutes, 0, 0);
				return session.status === SessionStatusEnum.UPCOMING && sessionDate > now;
			})
			.sort((sessionA, sessionB) => new Date(sessionA.date).getTime() - new Date(sessionB.date).getTime());

		if (upcoming.length === 0) return { sessions: [], total: sessions.total };

		const sessionIds = upcoming.map((s) => s.id);

		const requests = await this.rescheduleRequestRepo.findBySessionIds(sessionIds);

		const requestsMap = new Map<string, RescheduleRequestEntity>();

		for (const req of requests) {
			requestsMap.set(req.sessionId, req);
		}

		const sessionDtos = upcoming.map((session) => mapToMentorSessionDTO(session, requestsMap.get(session.id)));

		return { sessions: sessionDtos, total: sessions.total };
	}
}

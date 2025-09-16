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
		console.log("sessions: ", sessions.sessions);

		const now = new Date(); // current UTC time

		// Filter only for upcoming sessions in current batch, not total
		const upcoming = sessions.sessions
			.filter((session) => {
				const [hours, minutes] = session.endTime.split(":").map(Number);
				const sessionEndUTC = new Date(session.date);
				sessionEndUTC.setUTCHours(hours, minutes, 0, 0);

				return session.status === SessionStatusEnum.UPCOMING && sessionEndUTC > now;
			})
			.sort((a, b) => {
				// Sort by full end datetime
				const [ah, am] = a.endTime.split(":").map(Number);
				const [bh, bm] = b.endTime.split(":").map(Number);

				const dateA = new Date(a.date);
				dateA.setUTCHours(ah, am, 0, 0);

				const dateB = new Date(b.date);
				dateB.setUTCHours(bh, bm, 0, 0);

				return dateA.getTime() - dateB.getTime();
			});

		// Keep total from DB for pagination
		const total = sessions.total;

		if (upcoming.length === 0) {
			return { sessions: [], total };
		}

		const sessionIds = upcoming.map((s) => s.id);

		const requests = await this.rescheduleRequestRepo.findBySessionIds(sessionIds);

		const requestsMap = new Map<string, RescheduleRequestEntity>();
		for (const req of requests) {
			requestsMap.set(req.sessionId, req);
		}

		const sessionDtos = upcoming.map((session) => mapToMentorSessionDTO(session, requestsMap.get(session.id)));

		return { sessions: sessionDtos, total };
	}
}

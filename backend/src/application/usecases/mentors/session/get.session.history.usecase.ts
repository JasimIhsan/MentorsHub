import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { ISessionMentorDTO, mapToMentorSessionDTO } from "../../../dtos/session.dto";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { IGetSessionHistoryUsecase } from "../../../interfaces/usecases/mentors/mentors.interface";

export class GetSessionHistoryUsecase implements IGetSessionHistoryUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(mentorId: string, queryParams: { page: number; limit: number; status: SessionStatusEnum }): Promise<{ sessions: ISessionMentorDTO[]; total: number }> {
		const sessions = await this.sessionRepo.findByMentor(mentorId, queryParams);

		const sessionDtos = sessions.sessions.map((session) => mapToMentorSessionDTO(session));
		
		return { sessions: sessionDtos, total: sessions.total };
	}
}

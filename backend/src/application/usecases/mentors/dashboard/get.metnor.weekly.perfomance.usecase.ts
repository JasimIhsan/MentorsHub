import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IGetMentorWeeklyPerformanceUseCase } from "../../../interfaces/usecases/mentors/mentor.dashboard.interface";

export class GetMentorWeeklyPerformanceUseCase implements IGetMentorWeeklyPerformanceUseCase {
	constructor(private sessionRepository: ISessionRepository) {}

	async execute(mentorId: string, period: "all" | "month" | "sixMonths" | "year"): Promise<{ name: string; sessions: number; revenue: number }[]> {
		try {
			return await this.sessionRepository.getDailyPerformance(mentorId, period);
		} catch (error) {
			if (error instanceof Error) throw new Error(`Failed to fetch weekly performance: ${error.message}`);
			throw new Error("Failed to fetch weekly performance");
		}
	}
}

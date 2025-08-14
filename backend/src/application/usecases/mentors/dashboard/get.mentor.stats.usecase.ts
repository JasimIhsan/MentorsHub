import { IReviewRepository } from "../../../../domain/repositories/review.repository";
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { IGetMentorStatsUseCase, MentorStats } from "../../../interfaces/usecases/mentors/mentor.dashboard.interface";

export class GetMentorStatsUseCase implements IGetMentorStatsUseCase {
	constructor(private sessionRepository: ISessionRepository, private reviewRepository: IReviewRepository) {}

	async execute(mentorId: string): Promise<MentorStats> {
		try {
			const [upcomingCount, pendingCount, ratingStats, revenue] = await Promise.all([
				this.sessionRepository.findSessionCount(mentorId, SessionStatusEnum.UPCOMING),
				this.sessionRepository.findSessionCount(mentorId, SessionStatusEnum.PENDING),
				this.reviewRepository.calculateMentorRating(mentorId),
				this.sessionRepository.findRevenueByMentor(mentorId),
			]);
			return {
				upcomingSessions: upcomingCount,
				pendingRequests: pendingCount,
				averageRating: ratingStats.average,
				revenue,
			};
		} catch (error) {
			if (error instanceof Error) throw new Error(`Failed to fetch mentor stats: ${error.message}`);
			throw new Error("Failed to fetch mentor stats");
		}
	}
}

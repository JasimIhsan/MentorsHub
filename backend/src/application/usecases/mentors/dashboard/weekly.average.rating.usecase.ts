import { IReviewRepository } from "../../../../domain/repositories/review.repository";
import { IGetMentorWeeklyRatingsUseCase } from "../../../interfaces/mentors/mentor.dashboard.interface";

export class GetMentorWeeklyRatingsUseCase implements IGetMentorWeeklyRatingsUseCase {
	constructor(private reviewRepository: IReviewRepository) {}

	async execute(mentorId: string, period: "all" | "month" | "sixMonths" | "year"):  Promise<{ name: string; averageRating: number }[]> {
		try {
			return await this.reviewRepository.getMentorRatingChartData(mentorId, period);
		} catch (error) {
			if (error instanceof Error) throw new Error(`Failed to fetch weekly ratings: ${error.message}`);
			throw new Error("Failed to fetch weekly ratings");
		}
	}
}

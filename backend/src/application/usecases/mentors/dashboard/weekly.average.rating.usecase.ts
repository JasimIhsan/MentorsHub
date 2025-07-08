import { IReviewRepository } from "../../../../domain/repositories/review.repository";
import { IGetMentorWeeklyRatingsUseCase } from "../../../interfaces/mentors/mentor.dashboard.interface";

export class GetMentorWeeklyRatingsUseCase implements IGetMentorWeeklyRatingsUseCase {
	constructor(private reviewRepository: IReviewRepository) {}

	async execute(mentorId: string, period: "month" | "sixMonths" | "year"): Promise<{ week: string; averageRating: number }[]> {
		try {
			return await this.reviewRepository.getWeeklyRatings(mentorId, period);
		} catch (error) {
			if (error instanceof Error) throw new Error(`Failed to fetch weekly ratings: ${error.message}`);
			throw new Error("Failed to fetch weekly ratings");
		}
	}
}

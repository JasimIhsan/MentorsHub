import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { ReviewDTO } from "../../dtos/review.dtos";

export class GetMentorReviewsUseCase {
	constructor(private reviewRepo: IReviewRepository) {}

	async execute(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewDTO[]; total: number }> {
		return await this.reviewRepo.findByMentorId(mentorId, options);
	}
}

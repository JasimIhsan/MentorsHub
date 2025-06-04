import { ReviewEntity } from "../../../domain/entities/review.entity";
import { IReviewRepository } from "../../../domain/repositories/review.repository";

export class GetMentorReviewsUseCase {
	constructor(private reviewRepo: IReviewRepository) {}

	async execute(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewEntity[]; total: number }> {
		return await this.reviewRepo.findByMentorId(mentorId, options);
	}
}

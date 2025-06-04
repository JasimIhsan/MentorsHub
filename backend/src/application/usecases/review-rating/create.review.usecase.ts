import { ReviewEntity } from "../../../domain/entities/review.entity";
import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { ICreateReviewUseCase } from "../../interfaces/review";

export class CreateReviewUseCase implements ICreateReviewUseCase {
	constructor(private reviewRepo: IReviewRepository) {}

	async execute(data: { reviewerId: string; mentorId: string; sessionId?: string; rating: number; comment: string }): Promise<ReviewEntity> {
		if (!data.reviewerId) throw new Error("reviewerId is required");
		if (!data.mentorId) throw new Error("mentorId is required");
		if (!data.rating) throw new Error("rating is required");
		if (!data.comment) throw new Error("comment is required");
		
		return await this.reviewRepo.create(data);
	}
}

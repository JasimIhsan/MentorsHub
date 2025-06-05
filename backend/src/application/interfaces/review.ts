import { ReviewEntity } from "../../domain/entities/review.entity";
import { ReviewDTO } from "../dtos/review.dtos";

export interface ICreateReviewUseCase {
	execute(data: { reviewerId: string; mentorId: string; sessionId?: string; rating: number; comment: string }): Promise<ReviewEntity>;
}

export interface IGetMentorReviewsUseCase {
	execute(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewDTO[]; total: number }>;
}

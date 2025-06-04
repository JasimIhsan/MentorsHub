import { ReviewEntity } from "../../domain/entities/review.entity";

export interface ICreateReviewUseCase {
	execute(data: { reviewerId: string; mentorId: string; sessionId?: string; rating: number; comment: string }): Promise<ReviewEntity>;
}

export interface IGetMentorReviewsUseCase {
	execute(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewEntity[]; total: number }>;
}

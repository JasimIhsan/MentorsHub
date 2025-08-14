import { ReviewDTO } from "../../dtos/review.dtos";

export interface ICreateReviewUseCase {
	execute(data: { reviewerId: string; mentorId: string; sessionId?: string; rating: number; comment: string }): Promise<ReviewDTO>;
}

export interface IGetMentorReviewsUseCase {
	execute(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewDTO[]; total: number }>;
}

export interface IUpdateReviewUseCase {
	execute(reviewId: string, data: { reviewerId: string; mentorId: string; sessionId?: string; rating: number; comment: string }): Promise<ReviewDTO>;
}

export interface IDeleteReviewUseCase {
	execute(reviewId: string, mentorId: string, userId: string): Promise<void>;

}

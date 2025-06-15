import { ReviewDTO } from "../../application/dtos/review.dtos";
import { ReviewEntity } from "../entities/review.entity";

export interface IReviewRepository {
	create(review: { reviewerId: string; mentorId: string; rating: number; comment: string; sessionId?: string }): Promise<ReviewEntity>;
	findByMentorId(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewDTO[]; total: number }>;
	deleteById(id: string): Promise<void>;
	update(
		reviewId: string,
		data: {
			reviewerId: string;
			mentorId: string;
			sessionId?: string;
			rating: number;
			comment: string;
		}
	): Promise<ReviewEntity>;
	findById(id: string): Promise<ReviewEntity | null>;


	// findBySessionAndUser(sessionId: string, reviewerId: string): Promise<ReviewEntity | null>;
	// findAllByMentor(mentorId: string): Promise<ReviewEntity[]>;
	// Optional: helper
	calculateMentorRating(mentorId: string): Promise<{ average: number; total: number }>;
}

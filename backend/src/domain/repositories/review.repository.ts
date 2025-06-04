import { ReviewEntity } from "../entities/review.entity";

export interface IReviewRepository {
	create(review: { reviewerId: string; mentorId: string; rating: number; comment: string; sessionId?: string }): Promise<ReviewEntity>;
	findByMentorId(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewEntity[]; total: number }>;
	deleteById(id: string): Promise<void>;
	update(review: ReviewEntity): Promise<ReviewEntity>;

	// findBySessionAndUser(sessionId: string, reviewerId: string): Promise<ReviewEntity | null>;
	// findAllByMentor(mentorId: string): Promise<ReviewEntity[]>;
	// Optional: helper
	// calculateMentorRating(mentorId: string): Promise<{ average: number; total: number }>;
}

import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IDeleteReviewUseCase } from "../../interfaces/usecases/review";

export class DeleteReviewUseCase implements IDeleteReviewUseCase {
	constructor(private reviewRepo: IReviewRepository, private userRepo: IUserRepository) {}

	async execute(reviewId: string, mentorId: string, userId: string): Promise<void> {
		if (!reviewId) throw new Error("reviewId is required");
		if (!mentorId) throw new Error("mentorId is required");
		if (!userId) throw new Error("userId is required");

		const review = await this.reviewRepo.findById(reviewId);
		if (!review) throw new Error("Review not found");
		if (review.reviewerId !== userId) throw new Error("You can only delete your own review");

		// 1. Delete the review from the DB
		await this.reviewRepo.deleteById(reviewId);

		// 2. Recalculate average rating and total reviews for the mentor
		const { average, total } = await this.reviewRepo.calculateMentorRating(mentorId);

		// 3. Update the mentor's rating information
		const mentor = await this.userRepo.findUserById(mentorId);
		if (!mentor) throw new Error("Mentor not found");

		mentor.updateUserDetails({
			averageRating: average,
			totalReviews: total,
		});

		await this.userRepo.updateUser(mentorId, mentor);
	}
}

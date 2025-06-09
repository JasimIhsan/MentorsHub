import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IUpdateReviewUseCase } from "../../interfaces/review";
import { ReviewEntity } from "../../../domain/entities/review.entity";
import { ReviewDTO } from "../../dtos/review.dtos";

export class UpdateReviewUseCase implements IUpdateReviewUseCase {
	constructor(private reviewRepo: IReviewRepository, private userRepo: IUserRepository) {}

	async execute(
		reviewId: string,
		data: {
			reviewerId: string;
			mentorId: string;
			sessionId?: string;
			rating: number;
			comment: string;
		}
	): Promise<ReviewDTO> {
		if (!reviewId) throw new Error("reviewId is required");
		if (!data.reviewerId) throw new Error("reviewerId is required");
		if (!data.mentorId) throw new Error("mentorId is required");
		if (!data.rating) throw new Error("rating is required");
		if (!data.comment) throw new Error("comment is required");

		// 1. Update the review in DB
		const updatedReview = await this.reviewRepo.update(reviewId, data);

		// 2. Recalculate average rating and total reviews for the mentor
		const { average, total } = await this.reviewRepo.calculateMentorRating(data.mentorId);

		// 3. Update the mentor's rating info
		const mentor = await this.userRepo.findUserById(data.mentorId);
		if (!mentor) throw new Error("Mentor not found");

		mentor.updateUserDetails({
			averageRating: average,
			totalReviews: total,
		});

		await this.userRepo.updateUser(data.mentorId, mentor);

		// 4. Optionally fetch and attach reviewer info again (if frontend needs updated reviewer data)
		const reviewer = await this.userRepo.findUserById(data.reviewerId);
		if (!reviewer) throw new Error("Reviewer not found");

		updatedReview.updateReviewData({
			reviewerId: {
				id: data.reviewerId,
				firstName: reviewer.getFirstName(),
				lastName: reviewer.getLastName(),
				avatar: reviewer.getAvatar() ?? "",
			},
		});

		return ReviewEntity.toDTO(updatedReview);
	}
}

import { ICreateReviewUseCase } from "../../interfaces/review";
import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository"; // You need this
import { ReviewEntity } from "../../../domain/entities/review.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { IUpdateUserTaskProgressUseCase } from "../../interfaces/gamification";
import { ActionType } from "../../dtos/gamification.dto";

export class CreateReviewUseCase implements ICreateReviewUseCase {
	constructor(private reviewRepo: IReviewRepository, private userRepo: IUserRepository, private updateUserProgress: IUpdateUserTaskProgressUseCase) {}

	async execute(data: { reviewerId: string; mentorId: string; sessionId?: string; rating: number; comment: string }): Promise<ReviewEntity> {
		if (!data.reviewerId) throw new Error("reviewerId is required");
		if (!data.mentorId) throw new Error("mentorId is required");
		if (!data.rating) throw new Error("rating is required");
		if (!data.comment) throw new Error("comment is required");

		// 1. Create the review in DB
		const review = await this.reviewRepo.create(data);

		// 2. Calculate updated average and total reviews for the mentor
		const { average, total } = await this.reviewRepo.calculateMentorRating(data.mentorId);

		// 3. Find mentor and update their rating info
		const mentor = await this.userRepo.findUserById(data.mentorId);
		if (!mentor) throw new Error("Mentor not found");
		mentor.updateUserDetails({ averageRating: average, totalReviews: total });
		await this.userRepo.updateUser(data.mentorId, mentor);

		// 4. Find reviewer info to update review with reviewer's details
		const reviewer = await this.userRepo.findUserById(data.reviewerId);
		if (!reviewer) throw new Error("Reviewer not found");

		// 5. Update review entity with reviewer info
		review.updateReviewData({
			reviewerId: {
				firstName: reviewer.getFirstName(),
				lastName: reviewer.getLastName(),
				avatar: reviewer.getAvatar() ?? "",
				id: data.reviewerId,
			},
		});

		// update gamification task completion progress
		await this.updateUserProgress.execute(data.reviewerId, ActionType.GIVE_FEEDBACK);

		return review;
	}
}

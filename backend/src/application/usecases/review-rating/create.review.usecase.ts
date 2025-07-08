import { ICreateReviewUseCase } from "../../interfaces/review";
import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository"; // You need this
import { IUpdateUserTaskProgressUseCase } from "../../interfaces/gamification";
import { mapToReviewDTO, ReviewDTO } from "../../dtos/review.dtos";
import { ActionTypeEnum } from "../../interfaces/enums/gamification.action.type.enum";

export class CreateReviewUseCase implements ICreateReviewUseCase {
	constructor(private reviewRepo: IReviewRepository, private userRepo: IUserRepository, private updateUserProgress: IUpdateUserTaskProgressUseCase) {}

	async execute(data: { reviewerId: string; mentorId: string; sessionId?: string; rating: number; comment: string }): Promise<ReviewDTO> {
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

		// update gamification task completion progress
		await this.updateUserProgress.execute(data.reviewerId, ActionTypeEnum.GIVE_FEEDBACK);

		return mapToReviewDTO(review, reviewer);
	}
}

import { ICreateReviewUseCase } from "../../interfaces/usecases/review";
import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IUpdateUserTaskProgressUseCase } from "../../interfaces/usecases/gamification";
import { mapToReviewDTO, ReviewDTO } from "../../dtos/review.dtos";
import { ActionTypeEnum } from "../../interfaces/enums/gamification.action.type.enum";
import { INotifyUserUseCase } from "../../interfaces/usecases/notification/notification.usecase";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";

export class CreateReviewUseCase implements ICreateReviewUseCase {
	constructor(
		private reviewRepo: IReviewRepository,
		private userRepo: IUserRepository,
		private updateUserProgress: IUpdateUserTaskProgressUseCase,
		private notifyUserUseCase: INotifyUserUseCase, // ✅ Injected
	) {}

	async execute(data: { reviewerId: string; mentorId: string; sessionId?: string; rating: number; comment: string }): Promise<ReviewDTO> {
		if (!data.reviewerId) throw new Error("reviewerId is required");
		if (!data.mentorId) throw new Error("mentorId is required");
		if (!data.rating) throw new Error("rating is required");
		if (!data.comment) throw new Error("comment is required");

		// 1. Create the review
		const review = await this.reviewRepo.create(data);

		// 2. Update mentor's rating
		const { average, total } = await this.reviewRepo.calculateMentorRating(data.mentorId);
		const mentor = await this.userRepo.findUserById(data.mentorId);
		if (!mentor) throw new Error("Mentor not found");
		mentor.updateUserDetails({ averageRating: average, totalReviews: total });
		await this.userRepo.updateUser(data.mentorId, mentor);

		// 3. Get reviewer info
		const reviewer = await this.userRepo.findUserById(data.reviewerId);
		if (!reviewer) throw new Error("Reviewer not found");

		// 4. Update gamification task progress
		await this.updateUserProgress.execute(data.reviewerId, ActionTypeEnum.GIVE_FEEDBACK);

		// 5. ✅ Send notification to mentor
		await this.notifyUserUseCase.execute({
			title: "⭐ New Review Received",
			message: `${reviewer.fullName} left you a ${data.rating}-star review: "${data.comment}"`,
			isRead: false,
			recipientId: data.mentorId,
			type: NotificationTypeEnum.REVIEW,
			link: "/mentor/reviews",
		});

		return mapToReviewDTO(review, reviewer);
	}
}

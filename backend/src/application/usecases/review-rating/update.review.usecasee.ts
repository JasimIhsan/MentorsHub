import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IUpdateReviewUseCase } from "../../interfaces/review";
import { mapToReviewDTO, ReviewDTO } from "../../dtos/review.dtos";
import { INotifyUserUseCase } from "../../interfaces/notification/notification.usecase";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";

export class UpdateReviewUseCase implements IUpdateReviewUseCase {
	constructor(
		private reviewRepo: IReviewRepository,
		private userRepo: IUserRepository,
		private notifyUserUseCase: INotifyUserUseCase, // ✅ Injected here
	) {}

	async execute(
		reviewId: string,
		data: {
			reviewerId: string;
			mentorId: string;
			sessionId?: string;
			rating: number;
			comment: string;
		},
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

		// 4. Get reviewer info
		const reviewer = await this.userRepo.findUserById(data.reviewerId);
		if (!reviewer) throw new Error("Reviewer not found");

		// 5. ✅ Notify mentor about the review update
		await this.notifyUserUseCase.execute({
			title: "⭐ Review Updated",
			message: `${reviewer.fullName} updated their review to ${data.rating}-star.`,
			isRead: false,
			recipientId: data.mentorId,
			type: NotificationTypeEnum.REVIEW,
			link: "/mentor/reviews",
		});

		return mapToReviewDTO(updatedReview, reviewer);
	}
}

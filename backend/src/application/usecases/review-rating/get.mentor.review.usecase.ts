import { UserEntity } from "../../../domain/entities/user.entity";
import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { mapToReviewDTO, ReviewDTO } from "../../dtos/review.dtos";

export class GetMentorReviewsUseCase {
	constructor(private reviewRepo: IReviewRepository, private userRepo: IUserRepository) {}

	async execute(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewDTO[]; total: number }> {
		const review = await this.reviewRepo.findByMentorId(mentorId, options);

		const reviewerIds = [...new Set(review.reviews.map((review) => review.reviewerId))];

		let users: UserEntity[] = [];
		for (const userId of reviewerIds) {
			const user = await this.userRepo.findUserById(userId);
			if (!user) throw new Error("User not found");
			users.push(user);
		}

		const reviewerMap = new Map<string, UserEntity>();
		users.forEach((user) => reviewerMap.set(user.id!, user));

		const reviewsDTO = review.reviews.map((review) => mapToReviewDTO(review, reviewerMap.get(review.reviewerId)!));

		return { reviews: reviewsDTO, total: review.total };
	}
}

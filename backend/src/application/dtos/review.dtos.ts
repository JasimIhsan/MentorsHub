import { ReviewEntity } from "../../domain/entities/review.entity";
import { UserEntity } from "../../domain/entities/user.entity";

export interface ReviewerDTO {
	id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export interface ReviewDTO {
	id: string;
	reviewerId: ReviewerDTO;
	mentorId: string;
	sessionId: string;
	rating: number;
	comment: string;
	createdAt: Date;
	updatedAt: Date;
}

export function mapToReviewDTO(review: ReviewEntity, userEntity: UserEntity): ReviewDTO {
	return {
		id: review.id!,
		reviewerId: { id: userEntity.id!, firstName: userEntity.firstName, lastName: userEntity.lastName },
		mentorId: review.mentorId,
		sessionId: review.sessionId ?? "",
		rating: review.rating,
		comment: review.comment,
		createdAt: review.createdAt,
		updatedAt: review.updatedAt,
	};
}

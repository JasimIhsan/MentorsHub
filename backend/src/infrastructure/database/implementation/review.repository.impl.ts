import mongoose from "mongoose";
import { ReviewDTO } from "../../../application/dtos/review.dtos";
import { ReviewEntity } from "../../../domain/entities/review.entity";
import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { ReviewModel } from "../models/review-rating/review.model";
import { handleExceptionError } from "../../utils/handle.exception.error";

export class ReviewRepositoryImpl implements IReviewRepository {
	async create(review: {
		reviewerId: string;
		mentorId: string;
		rating: number;
		comment: string;
		sessionId?: string;
	}): Promise<ReviewEntity> {
		try {
			const newReview = new ReviewModel(review);
			await newReview.save();
			return ReviewEntity.fromDBDocument(newReview);
		} catch (error) {
			return handleExceptionError(error, "Error creating review");
		}
	}

	async findByMentorId(
		mentorId: string,
		options?: { page?: number; limit?: number; rating?: number }
	): Promise<{ reviews: ReviewDTO[]; total: number }> {
		try {
			const page = options?.page ?? 1;
			const limit = options?.limit ?? 10;
			const skip = (page - 1) * limit;

			const filter: any = { mentorId };
			if (options?.rating !== undefined) filter.rating = options.rating;

			const [docs, total] = await Promise.all([
				ReviewModel.find(filter)
					.populate("reviewerId", "firstName lastName avatar")
					.skip(skip)
					.limit(limit)
					.sort({ createdAt: -1 }),
				ReviewModel.countDocuments(filter),
			]);

			const reviewEntities = docs.map((doc) => ReviewEntity.fromDBDocument(doc));
			const reviews = reviewEntities.map((review) => this.mapReviewToReviewDTO(review));
			return { reviews, total };
		} catch (error) {
			return handleExceptionError(error, "Error fetching reviews for mentor");
		}
	}

	async deleteById(id: string): Promise<void> {
		try {
			await ReviewModel.findByIdAndDelete(id);
		} catch (error) {
			return handleExceptionError(error, "Error deleting review");
		}
	}

	async update(
		reviewId: string,
		data: {
			reviewerId: string;
			mentorId: string;
			sessionId?: string;
			rating: number;
			comment: string;
		}
	): Promise<ReviewEntity> {
		try {
			const updated = await ReviewModel.findByIdAndUpdate(reviewId, data, { new: true });
			if (!updated) throw new Error("Review not found");
			return ReviewEntity.fromDBDocument(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating review");
		}
	}

	private mapReviewToReviewDTO(review: ReviewEntity): ReviewDTO {
		return {
			id: review.id ?? "",
			reviewerId: review.getReviewer(),
			mentorId: review.getMentorId(),
			sessionId: review.getSessionId() ?? "",
			rating: review.getRating(),
			comment: review.getComment(),
			createdAt: review.getCreatedAt(),
			updatedAt: review.getUpdatedAt(),
		};
	}

	async calculateMentorRating(mentorId: string): Promise<{ average: number; total: number }> {
		try {
			const result = await ReviewModel.aggregate([
				{ $match: { mentorId: new mongoose.Types.ObjectId(mentorId) } },
				{
					$group: {
						_id: "$mentorId",
						average: { $avg: "$rating" },
						total: { $sum: 1 },
					},
				},
			]);

			if (result.length === 0) return { average: 0, total: 0 };
			return { average: parseFloat(result[0].average.toFixed(1)), total: result[0].total };
		} catch (error) {
			return handleExceptionError(error, "Error calculating mentor rating");
		}
	}

	async findById(id: string): Promise<ReviewEntity | null> {
		try {
			const doc = await ReviewModel.findById(id);
			return doc ? ReviewEntity.fromDBDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding review by ID");
		}
	}
}

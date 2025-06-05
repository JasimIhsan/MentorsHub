import mongoose from "mongoose";
import { ReviewDTO } from "../../../application/dtos/review.dtos";
import { ReviewEntity } from "../../../domain/entities/review.entity";
import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { IReviewDocument, ReviewModel } from "../models/review-rating/review.model";

export class ReviewRepositoryImpl implements IReviewRepository {
	async create(review: { reviewerId: string; mentorId: string; rating: number; comment: string; sessionId?: string }): Promise<ReviewEntity> {
		const newReview = new ReviewModel(review);
		await newReview.save();
		return ReviewEntity.fromDBDocument(newReview);
	}

	async findByMentorId(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewDTO[]; total: number }> {
		console.log("options: ", options);
		const page = options?.page ?? 1;
		const limit = options?.limit ?? 10;
		const skip = (page - 1) * limit;

		// Create filter object
		const filter: any = { mentorId };
		if (options?.rating !== undefined) {
			filter.rating = options.rating;
		}

		// Fetch reviews with filters and pagination
		const [docs, total] = await Promise.all([
			ReviewModel.find(filter).populate("reviewerId", "firstName lastName avatar").skip(skip).limit(limit).sort({ createdAt: -1 }), // latest reviews first

			ReviewModel.countDocuments(filter),
		]);

		const reviewEntities = docs.map((doc) => ReviewEntity.fromDBDocument(doc));
		const reviews = reviewEntities.map((review) => this.mapReviewToReviewDTO(review));
		return { reviews, total };
	}

	async deleteById(id: string): Promise<void> {
		await ReviewModel.findByIdAndDelete(id);
	}

	async update(review: ReviewEntity): Promise<ReviewEntity> {
		const updated = await ReviewModel.findByIdAndUpdate(review.id, review.toObject(), { new: true });
		if (!updated) throw new Error("Review not found");
		return ReviewEntity.fromDBDocument(updated);
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

	// async findAllByMentor(mentorId: string): Promise<ReviewEntity[]> {
	// 	return this.findByMentorId(mentorId);
	// }

	// async findBySessionAndUser(sessionId: string, reviewerId: string): Promise<ReviewEntity | null> {
	// 	const doc = await ReviewModel.findOne({ sessionId, reviewerId });
	// 	return doc ? ReviewEntity.fromDBDocument(doc) : null;
	// }

	async calculateMentorRating(mentorId: string): Promise<{ average: number; total: number }> {
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

		console.log(`result: `, result);

		if (result.length === 0) return { average: 0, total: 0 };
		return { average: result[0].average.toFixed(1), total: result[0].total };
	}
}

import { ReviewEntity } from "../../../domain/entities/review.entity";
import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { ReviewModel } from "../models/review-rating/review.model";

export class ReviewRepositoryImpl implements IReviewRepository {
	async create(review: { reviewerId: string; mentorId: string; rating: number; comment: string; sessionId?: string }): Promise<ReviewEntity> {
		const newReview = new ReviewModel(review);
		await newReview.save();
		return ReviewEntity.fromDBDocument(newReview);
	}

	async findByMentorId(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewEntity[]; total: number }> {
		console.log('options: ', options);
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
			ReviewModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }), // latest reviews first

			ReviewModel.countDocuments(filter),
		]);

		const reviews = docs.map((doc) => ReviewEntity.fromDBDocument(doc));
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

	// async findAllByMentor(mentorId: string): Promise<ReviewEntity[]> {
	// 	return this.findByMentorId(mentorId);
	// }

	// async findBySessionAndUser(sessionId: string, reviewerId: string): Promise<ReviewEntity | null> {
	// 	const doc = await ReviewModel.findOne({ sessionId, reviewerId });
	// 	return doc ? ReviewEntity.fromDBDocument(doc) : null;
	// }

	// async calculateMentorRating(mentorId: string): Promise<{ average: number; total: number }> {
	// const result = await ReviewModel.aggregate([
	// 	{ $match: { mentorId: new ReviewModel.Types.ObjectId(mentorId) } },
	// 	{
	// 		$group: {
	// 			_id: "$mentorId",
	// 			average: { $avg: "$rating" },
	// 			total: { $sum: 1 },
	// 		},
	// 	},
	// ]);

	// if (result.length === 0) return { average: 0, total: 0 };
	// return { average: result[0].average, total: result[0].total };
	// }
}

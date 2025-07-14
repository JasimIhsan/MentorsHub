import mongoose from "mongoose";
import { ReviewEntity } from "../../../domain/entities/review.entity";
import { IReviewRepository } from "../../../domain/repositories/review.repository";
import { ReviewModel } from "../models/review-rating/review.model";
import { handleExceptionError } from "../../utils/handle.exception.error";

export class ReviewRepositoryImpl implements IReviewRepository {
	async create(review: { reviewerId: string; mentorId: string; rating: number; comment: string; sessionId?: string }): Promise<ReviewEntity> {
		try {
			const newReview = new ReviewModel(review);
			await newReview.save();
			return ReviewEntity.fromDBDocument(newReview);
		} catch (error) {
			return handleExceptionError(error, "Error creating review");
		}
	}

	async findByMentorId(mentorId: string, options?: { page?: number; limit?: number; rating?: number }): Promise<{ reviews: ReviewEntity[]; total: number }> {
		try {
			const page = options?.page ?? 1;
			const limit = options?.limit ?? 10;
			const skip = (page - 1) * limit;

			const filter: any = { mentorId };
			if (options?.rating !== undefined) filter.rating = options.rating;

			const [docs, total] = await Promise.all([ReviewModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }), ReviewModel.countDocuments(filter)]);

			const reviewEntities = docs.map((doc) => ReviewEntity.fromDBDocument(doc));
			return { reviews: reviewEntities, total };
		} catch (error) {
			return handleExceptionError(error, "Error fetching reviews for mentor");
		}
	}

	async deleteById(id: string): Promise<void> {
		try {
			const deleted = await ReviewModel.findByIdAndDelete(id);
			if (!deleted) throw new Error("Review not found");
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

	async getMentorRatingChartData(mentorId: string, period: "all" | "month" | "sixMonths" | "year"): Promise<{ name: string; averageRating: number }[]> {
		try {
			const match: any = {
				mentorId: new mongoose.Types.ObjectId(mentorId),
			};

			if (period !== "all") {
				const now = new Date();
				if (period === "month") now.setDate(now.getDate() - 30);
				else if (period === "sixMonths") now.setMonth(now.getMonth() - 6);
				else if (period === "year") now.setFullYear(now.getFullYear() - 1);

				match.createdAt = { $gte: now };
			}

			const result = await ReviewModel.aggregate([
				{ $match: match },

				{
					$group: {
						_id: {
							year: { $year: "$createdAt" },
							month: { $month: "$createdAt" },
							day: { $dayOfMonth: "$createdAt" },
						},
						averageRating: { $avg: "$rating" },
					},
				},

				{
					$project: {
						name: {
							$concat: [{ $toString: "$_id.day" }, "-", { $toString: "$_id.month" }, "-", { $toString: "$_id.year" }],
						},
						averageRating: { $round: ["$averageRating", 1] },
						sortDate: {
							$dateFromParts: {
								year: "$_id.year",
								month: "$_id.month",
								day: "$_id.day",
							},
						},
						_id: 0,
					},
				},

				{ $sort: { sortDate: 1 } },

				{
					$project: {
						name: 1,
						averageRating: 1,
					},
				},
			]);

			return result as { name: string; averageRating: number }[];
		} catch (error) {
			return handleExceptionError(error, "Error fetching daily ratings");
		}
	}
}

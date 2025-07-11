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
		},
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

	async getWeeklyRatings(mentorId: string, period: "month" | "sixMonths" | "year"): Promise<{ week: string; averageRating: number }[]> {
		try {
			const startDate = new Date();
			if (period === "month") startDate.setDate(startDate.getDate() - 30);
			else if (period === "sixMonths") startDate.setMonth(startDate.getMonth() - 6);
			else startDate.setFullYear(startDate.getFullYear() - 1);

			const result = await ReviewModel.aggregate([
				{
					$match: {
						mentorId: new mongoose.Types.ObjectId(mentorId),
						createdAt: { $gte: startDate },
					},
				},
				{
					$group: {
						_id: {
							week: { $isoWeek: "$createdAt" },
							year: { $isoWeekYear: "$createdAt" },
						},
						averageRating: { $avg: "$rating" },
					},
				},
				{
					$sort: { "_id.year": 1, "_id.week": 1 },
				},
				{
					$project: {
						week: { $concat: ["Week ", { $toString: "$_id.week" }, " ", { $toString: "$_id.year" }] },
						averageRating: { $round: ["$averageRating", 1] },
					},
				},
			]);

			console.log(`Weekly ratings for mentor ${mentorId} : `, result);

			return result.map((r) => ({ week: r.week, averageRating: r.averageRating }));
		} catch (error) {
			return handleExceptionError(error, "Error fetching weekly ratings");
		}
	}
}

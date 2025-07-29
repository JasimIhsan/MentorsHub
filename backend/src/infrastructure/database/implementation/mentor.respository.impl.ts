import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { MentorProfileEntity } from "../../../domain/entities/mentor.detailes.entity";
import { IMentorProfileModel, MentorProfileModel } from "../models/user/mentor.details.model";
import { IUsersDocument, UserModel } from "../models/user/user.model";
import { IAvailabilityDTO } from "../../../application/dtos/availability.dto";
import { MentorEntity } from "../../../domain/entities/mentor.entity";
import mongoose from "mongoose";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { MentorRequestStatusEnum } from "../../../application/interfaces/enums/mentor.request.status.enum";
import { WalletTransactionModel } from "../models/wallet/wallet.transaction.model";
import { SessionModel } from "../models/session/session.model";

type AggregatedMentorDoc = IMentorProfileModel & {
	user: IUsersDocument; // because $lookup + $unwind gives you a single user object
};

// Error handler
const handleExceptionError = (error: unknown, message: string): never => {
	console.error(`${message}:`, error);
	throw new Error(error instanceof Error ? error.message : message);
};

export class MentorDetailsRepositoryImpl implements IMentorProfileRepository {
	async findByUserId(userId: string): Promise<MentorProfileEntity | null> {
		try {
			const result = await MentorProfileModel.findOne({ userId });
			return result ? MentorProfileEntity.fromDBDocument(result) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding mentor details by user ID");
		}
	}

	async updateMentorProfile(userId: string, updatedData: MentorProfileEntity): Promise<MentorProfileEntity> {
		try {
			const updated = await MentorProfileModel.findOneAndUpdate({ userId }, MentorProfileEntity.toObject(updatedData), { new: true });
			if (!updated) throw new Error("Mentor profile not found");
			return MentorProfileEntity.fromDBDocument(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating mentor details");
		}
	}

	async createMentorProfile(userId: string, data: MentorProfileEntity): Promise<MentorProfileEntity> {
		try {
			const mentor = new MentorProfileModel(MentorProfileEntity.toObject(data));
			const saved = await mentor.save();
			return MentorProfileEntity.fromDBDocument(saved);
		} catch (error) {
			return handleExceptionError(error, "Error creating mentor profile");
		}
	}

	async findAllMentors({ page = 1, limit = 10, search = "", status = "" }) {
		try {
			const skip = (page - 1) * limit;
			const match: any = {};
			if (status) match["userId.mentorRequestStatus"] = status;
			if (search) {
				match.$or = [
					{ "userId.firstName": { $regex: search, $options: "i" } },
					{ "userId.lastName": { $regex: search, $options: "i" } },
					{ professionalTitle: { $regex: search, $options: "i" } },
					{ "userId.skills": { $regex: search, $options: "i" } },
				];
			}

			const [result] = await MentorProfileModel.aggregate([
				{ $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userId" } },
				{ $unwind: "$userId" },
				{ $match: match },
				{
					$facet: {
						data: [{ $skip: skip }, { $limit: limit }],
						total: [{ $count: "count" }],
					},
				},
			]);

			const mentors = result.data.map(MentorEntity.fromMongo);
			const total = result.total[0]?.count || 0;

			return { mentors, total };
		} catch (err) {
			return handleExceptionError(err, "Error finding mentors");
		}
	}

	/* ---------------------------------------------------------------- */
	async findAllApprovedMentors(
		params: {
			page: number;
			limit: number;
			search?: string;
			sortBy?: string;
			priceMin?: number;
			priceMax?: number;
			skills?: string[];
		},
		browserId: string
	): Promise<{ mentors: MentorEntity[]; total: number }> {
		try {
			const page = params.page ?? 1;
			const limit = params.limit ?? 12;
			const skip = (page - 1) * limit;

			const pipeline: any[] = [];

			// 💰 Price filter (includes free mentors always)
			if (params.priceMin !== undefined || params.priceMax !== undefined) {
				const priceRange: any = {};

				if (params.priceMin !== undefined) priceRange.$gte = params.priceMin;
				if (params.priceMax !== undefined) priceRange.$lte = params.priceMax;

				pipeline.push({
					$match: {
						$or: [
							{ hourlyRate: priceRange },
							{ hourlyRate: null }, // ⬅️ always include free mentors
						],
					},
				});
			}

			// Join with users
			pipeline.push({
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user",
				},
			});

			pipeline.push({ $unwind: "$user" });

			// Filter only approved mentors (not self)
			pipeline.push({
				$match: {
					"user.role": RoleEnum.MENTOR,
					"user.mentorRequestStatus": MentorRequestStatusEnum.APPROVED,
					"user._id": { $ne: new mongoose.Types.ObjectId(browserId) },
				},
			});

			// Search
			if (params.search?.trim()) {
				const regex = new RegExp(params.search.trim(), "i");
				pipeline.push({
					$match: {
						$or: [{ "user.firstName": regex }, { "user.lastName": regex }, { professionalTitle: regex }],
					},
				});
			}

			// Filter by interests
			if (params.skills?.length) {
				pipeline.push({
					$match: { "user.skills": { $in: params.skills } },
				});
			}

			// Sorting
			const sortMap: Record<string, any> = {
				recommended: { "user.averageRating": -1 }, // Default
				rating: { "user.averageRating": -1 }, // Highest rated
				reviews: { "user.totalReviews": -1 }, // Most reviewed
				newest: { "user.createdAt": -1 }, // Newly joined mentors
				"price-low": { hourlyRate: 1 },
				"price-high": { hourlyRate: -1 },
			};

			const sortKey = sortMap[params.sortBy ?? "recommended"] || sortMap["recommended"];
			pipeline.push({ $sort: sortKey });

			// Facet
			pipeline.push({
				$facet: {
					data: [{ $skip: skip }, { $limit: limit }],
					total: [{ $count: "count" }],
				},
			});

			const result = await MentorProfileModel.aggregate(pipeline);
			const mentorsRaw = result[0]?.data || [];
			const total = result[0]?.total[0]?.count ?? 0;

			const mentors = mentorsRaw.map(
				(doc: AggregatedMentorDoc) =>
					new MentorEntity({
						id: doc._id?.toString()!,
						email: doc.user.email,
						firstName: doc.user.firstName,
						role: doc.user.role,
						lastName: doc.user.lastName,
						avatar: doc.user.avatar,
						bio: doc.user.bio,
						interests: doc.user.interests,
						updatedAt: doc.user.updatedAt,
						skills: doc.user.skills,
						status: doc.user.status,
						mentorRequestStatus: doc.user.mentorRequestStatus,
						createdAt: doc.createdAt,
						averageRating: doc.user.averageRating,
						totalReviews: doc.user.totalReviews,
						sessionCompleted: doc.user.sessionCompleted,
						badges: doc.user.badges,
						userId: doc.user._id.toString(),

						pricing: doc.pricing,
						availability: doc.availability,
						documents: doc.documents,

						professionalTitle: doc.professionalTitle,
						languages: doc.languages,
						primaryExpertise: doc.primaryExpertise,
						yearsExperience: doc.yearsExperience,
						workExperiences: doc.workExperiences,
						educations: doc.educations,
						certifications: doc.certifications,
						sessionFormat: doc.sessionFormat,
						hourlyRate: doc.hourlyRate,
					})
			);

			return { mentors, total };
		} catch (err) {
			throw handleExceptionError(err, "Error finding approved mentors");
		}
	}

	/* ---------------------------------------------------------------- */
	async findMentorByUserId(userId: string) {
		try {
			const doc = await MentorProfileModel.findOne({ userId }).populate("userId");
			return doc && doc.userId ? MentorEntity.fromMongo(doc) : null;
		} catch (err) {
			return handleExceptionError(err, "Error finding mentor by userId");
		}
	}

	async getAvailability(userId: string): Promise<IAvailabilityDTO | null> {
		try {
			const result = await MentorProfileModel.findOne({ userId }, { availability: 1, _id: 0 }).lean();
			if (!result) return null;
			return { userId, availability: result.availability };
		} catch (error) {
			throw handleExceptionError(error, "Error finding mentor availability");
		}
	}

	async getTopFiveMentors(): Promise<{ id: string; name: string; totalSessions: number; totalRevenue: number; averageRating: number; avatar: string }[]> {
		try {
			// Step 1: Get Top 5 Mentors sorted by averageRating
			const topMentors = await UserModel.find({ role: "mentor" }).sort({ averageRating: -1 }).limit(5).select("_id firstName lastName avatar averageRating sessionCompleted");

			const mentorIds = topMentors.map((mentor) => mentor._id);

			// Step 2: Get total revenue for each mentor
			const revenueData = await WalletTransactionModel.aggregate([
				{
					$match: {
						toUserId: { $in: mentorIds },
						purpose: "session_fee",
					},
				},
				{
					$group: {
						_id: "$toUserId",
						totalRevenue: { $sum: "$amount" },
					},
				},
			]);

			// Step 3: Get session count for each mentor
			const sessionData = await SessionModel.aggregate([
				{
					$match: {
						mentorId: { $in: mentorIds },
						status: "completed", // assuming this field marks a finished session
					},
				},
				{
					$group: {
						_id: "$mentorId",
						totalSessions: { $sum: 1 },
					},
				},
			]);

			// Convert revenue and session data into maps for fast lookup
			const revenueMap = new Map<string, number>();
			revenueData.forEach((item) => {
				revenueMap.set(item._id.toString(), item.totalRevenue);
			});

			const sessionMap = new Map<string, number>();
			sessionData.forEach((item) => {
				sessionMap.set(item._id.toString(), item.totalSessions);
			});

			// Step 4: Merge everything into final result
			const chartData = topMentors.map((mentor) => {
				const fullName = `${mentor.firstName} ${mentor.lastName || ""}`.trim();
				const avatar = mentor.avatar || "";
				const totalRevenue = revenueMap.get(mentor._id.toString()) || 0;
				const totalSessions = mentor.sessionCompleted || 0;
				const averageRating = mentor.averageRating || 0;

				return {
					id: mentor._id.toString(),
					name: fullName,
					avatar,
					averageRating,
					totalRevenue,
					totalSessions,
				};
			});

			return chartData;
		} catch (error) {
			throw handleExceptionError(error, "Error fetching top mentors data for admin chart");
		}
	}
}

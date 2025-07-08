import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { MentorProfileEntity } from "../../../domain/entities/mentor.detailes.entity";
import { IMentorProfileModel, MentorProfileModel } from "../models/user/mentor.details.model";
import { IUsersDocument } from "../models/user/user.model";
import { IAvailabilityDTO } from "../../../application/dtos/availability.dto";
import { MentorEntity } from "../../../domain/entities/mentor.entity";
import mongoose from "mongoose";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { MentorRequestStatusEnum } from "../../../application/interfaces/enums/mentor.request.status.enum";

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

	async updateMentorProfile(userId: string, updatedData: Partial<MentorProfileEntity>): Promise<MentorProfileEntity> {
		try {
			const updated = await MentorProfileModel.findOneAndUpdate({ userId }, updatedData, { new: true });
			if (!updated) throw new Error("Mentor profile not found");
			return MentorProfileEntity.fromDBDocument(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating mentor details");
		}
	}

	async createMentorProfile(userId: string, data: MentorProfileEntity): Promise<MentorProfileEntity> {
		try {
			const mentor = new MentorProfileModel({ ...data, userId });
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
			interests?: string[];
		},
		browserId: string,
	): Promise<{ mentors: MentorEntity[]; total: number }> {
		try {
			const page = params.page ?? 1;
			const limit = params.limit ?? 12;
			const skip = (page - 1) * limit;

			// Build the aggregation pipeline
			const pipeline: any[] = [];

			// Stage 1: Price filter on MentorProfile
			const priceFilter: any = {};
			if (params.priceMin !== undefined) priceFilter.$gte = params.priceMin;
			if (params.priceMax !== undefined) priceFilter.$lte = params.priceMax;
			if (Object.keys(priceFilter).length) {
				pipeline.push({
					$match: {
						hourlyRate: priceFilter,
					},
				});
			}

			// Stage 2: Lookup user (join with UserModel)
			pipeline.push({
				$lookup: {
					from: "users", // collection name (check your MongoDB if plural)
					localField: "userId",
					foreignField: "_id",
					as: RoleEnum.USER,
				},
			});

			// Stage 3: Unwind user array
			pipeline.push({
				$unwind: "$user",
			});

			// Stage 4: Filter for approved mentors only and exclude self
			pipeline.push({
				$match: {
					"user.role": RoleEnum.MENTOR,
					"user.mentorRequestStatus": MentorRequestStatusEnum.APPROVED,
					"user._id": { $ne: new mongoose.Types.ObjectId(browserId) },
				},
			});

			// Stage 5: Apply search filter if present
			if (params.search?.trim()) {
				const searchRegex = new RegExp(params.search.trim(), "i");
				pipeline.push({
					$match: {
						$or: [{ "user.firstName": searchRegex }, { "user.lastName": searchRegex }, { professionalTitle: searchRegex }],
					},
				});
			}

			// Stage 6: Filter by interests (if given)
			if (params.interests?.length) {
				pipeline.push({
					$match: {
						"user.interests": { $in: params.interests },
					},
				});
			}

			// Stage 7: Sorting
			const sortMap: Record<string, any> = {
				recommended: { "user.averageRating": -1 },
				priceLowToHigh: { hourlyRate: 1 },
				priceHighToLow: { hourlyRate: -1 },
				experience: { yearsExperience: -1 },
			};
			const sortStage = sortMap[params.sortBy ?? "recommended"] || sortMap["recommended"];
			pipeline.push({ $sort: sortStage });

			// Stage 8: Facet to get paginated data and total count together
			pipeline.push({
				$facet: {
					data: [{ $skip: skip }, { $limit: limit }],
					total: [{ $count: "count" }],
				},
			});

			// Execute pipeline
			const result = await MentorProfileModel.aggregate(pipeline);

			const mentorsRaw = result[0].data;
			const total = result[0].total[0]?.count ?? 0;

			// Convert documents into MentorEntity (optional step)
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

						// 💡 the three you missed:
						pricing: doc.pricing,
						availability: doc.availability, // that Map from your schema
						documents: doc.documents,

						professionalTitle: doc.professionalTitle,
						languages: doc.languages,
						primaryExpertise: doc.primaryExpertise,
						yearsExperience: doc.yearsExperience,
						workExperiences: doc.workExperiences,
						educations: doc.educations,
						certifications: doc.certifications,
						sessionFormat: doc.sessionFormat,
						sessionTypes: doc.sessionTypes,
						hourlyRate: doc.hourlyRate,
					}),
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
}

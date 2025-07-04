import { IMentorDTO } from "../../../application/dtos/mentor.dtos";
import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { MentorProfileEntity } from "../../../domain/entities/mentor.detailes.entity";
import { MentorProfileModel } from "../models/user/mentor.details.model";
import { UserModel } from "../models/user/user.model";
import { IAvailabilityDTO } from "../../../application/dtos/availability.dto";
import { MentorEntity } from "../../../domain/entities/mentor.entity";

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
	async findAllApprovedMentors(params: { page: number; limit: number; search?: string; sortBy?: string; priceMin?: number; priceMax?: number; interests?: string[] }): Promise<{ mentors: MentorEntity[]; total: number }> {
		console.log('params: ', params);
		try {
			/* ---------- 1. Pagination helpers ---------- */
			const page = params.page ?? 1; // default page 1
			const limit = params.limit ?? 12; // default 12 per page
			const skip = (page - 1) * limit; // correct skip

			/* ---------- 2. Build dynamic Mongo query ---------- */
			const query: any = {};

			// Full‑text‑ish search on three fields
			if (params.search?.trim()) {
				const regex = new RegExp(params.search.trim(), "i");
				query.$or = [{ firstName: regex }, { professionalTitle: regex }, { interests: regex }];
			}

			// Price range
			if (params.priceMin !== undefined || params.priceMax !== undefined) {
				query.hourlyRate = {};
				if (params.priceMin !== undefined) query.hourlyRate.$gte = params.priceMin;
				if (params.priceMax !== undefined) query.hourlyRate.$lte = params.priceMax;
			}

			// Interests array
			if (params.interests?.length) {
				query.interests = { $in: params.interests };
			}

			/* ---------- 3. Build sort map ---------- */
			const sort: Record<string, 1 | -1> = {};
			switch (params.sortBy) {
				case "price-low":
					sort.hourlyRate = 1;
					break;
				case "price-high":
					sort.hourlyRate = -1;
					break;
				case "rating":
					sort.averageRating = -1;
					break;
				case "reviews":
					sort.totalReviews = -1;
					break;
				case "newest":
					sort.createdAt = -1;
					break;
				default:
					sort.averageRating = -1;
			}

			console.log(`query : `, query);
			console.log(`sort : `, sort);

			/* ---------- 4. Main paginated query ---------- */
			// searching issue beacause of populate it search the name in details collection not in users
			const docs = await MentorProfileModel.find(query)
				.populate({
					path: "userId",
					model: UserModel,
					match: { role: "mentor", mentorRequestStatus: "approved" },
				})
				.sort(sort)
				.skip(skip)
				.limit(limit);
			console.log(`docs : `, docs);
			// Remove any profiles whose user failed the populate match
			const mentors = docs.filter((d) => d.userId).map(MentorEntity.fromMongo);
			console.log("mentors: ", mentors);

			/* ---------- 5. “Total rows” query (same filters, no pagination) ---------- */
			const totalDocs = await MentorProfileModel.find(query)
				.populate({
					path: "userId",
					model: UserModel,
					match: { role: "mentor", mentorRequestStatus: "approved" },
				})
				.countDocuments();
			console.log("totalDocs: ", totalDocs);

			return { mentors, total: totalDocs };
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

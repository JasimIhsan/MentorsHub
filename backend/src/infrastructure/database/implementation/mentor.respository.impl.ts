import { IMentorDTO } from "../../../application/dtos/mentor.dtos";
import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { Availability, IMentorInterface, MentorProfileEntity } from "../../../domain/entities/mentor.detailes.entity";
import { MentorProfileModel } from "../models/user/mentor.details.model";
import { IUsers, UserModel } from "../models/user/user.model";
import { IAvailabilityDTO } from "../../../application/dtos/availability.dto";

// Error handler
const handleError = (error: unknown, message: string): never => {
	console.error(`${message}:`, error);
	throw new Error(error instanceof Error ? error.message : message);
};

export class MentorDetailsRepositoryImpl implements IMentorProfileRepository {
	async findByUserId(userId: string): Promise<MentorProfileEntity | null> {
		try {
			const result = await MentorProfileModel.findOne({ userId });
			return result ? MentorProfileEntity.fromDBDocument(result) : null;
		} catch (error) {
			return handleError(error, "Error finding mentor details by user ID");
		}
	}

	async updateMentorProfile(userId: string, updatedData: Partial<MentorProfileEntity>): Promise<MentorProfileEntity> {
		try {
			const updated = await MentorProfileModel.findOneAndUpdate({ userId }, updatedData, { new: true });
			if (!updated) throw new Error("Mentor profile not found");
			return MentorProfileEntity.fromDBDocument(updated);
		} catch (error) {
			return handleError(error, "Error updating mentor details");
		}
	}

	async createMentorProfile(userId: string, data: MentorProfileEntity): Promise<MentorProfileEntity> {
		try {
			const mentor = new MentorProfileModel({ ...data, userId });
			const saved = await mentor.save();
			return MentorProfileEntity.fromDBDocument(saved);
		} catch (error) {
			return handleError(error, "Error creating mentor profile");
		}
	}

	async findAllMentors(query: { page?: number; limit?: number; search?: string; status?: string }): Promise<{
		mentors: IMentorDTO[];
		total: number;
	}> {
		try {
			const page = query.page || 1;
			const limit = query.limit || 10;
			const skip = (page - 1) * limit;
			const search = query.search || "";
			const status = query.status || "";

			// Build MongoDB query
			const match: any = {};
			if (status) {
				match["userId.mentorRequestStatus"] = status;
			}
			if (search) {
				match.$or = [
					{ "userId.firstName": { $regex: search, $options: "i" } },
					{ "userId.lastName": { $regex: search, $options: "i" } },
					{ professionalTitle: { $regex: search, $options: "i" } },
					{ "userId.skills": { $regex: search, $options: "i" } },
				];
			}

			// Aggregation pipeline
			const mentors = await MentorProfileModel.aggregate([
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

			const mentorDTOs: IMentorDTO[] = mentors[0].data.map((mentor: any) => ({
				email: mentor.userId.email,
				password: mentor.userId.password,
				firstName: mentor.userId.firstName,
				role: mentor.userId.role,
				lastName: mentor.userId.lastName,
				avatar: mentor.userId.avatar,
				bio: mentor.userId.bio,
				interests: mentor.userId.interests,
				updatedAt: mentor.userId.updatedAt,
				skills: mentor.userId.skills,
				status: mentor.userId.status,
				mentorRequestStatus: mentor.userId.mentorRequestStatus,
				isVerified: mentor.userId.isVerified,
				averageRating: mentor.userId.averageRating,
				totalReviews: mentor.userId.totalReviews,
				sessionCompleted: mentor.userId.sessionCompleted,
				featuredMentor: mentor.userId.featuredMentor,
				badges: mentor.userId.badges,
				userId: mentor.userId._id,
				professionalTitle: mentor.professionalTitle,
				languages: mentor.languages,
				primaryExpertise: mentor.primaryExpertise,
				yearsExperience: mentor.yearsExperience,
				workExperiences: mentor.workExperiences,
				educations: mentor.educations,
				certifications: mentor.certifications,
				sessionFormat: mentor.sessionFormat,
				sessionTypes: mentor.sessionTypes,
				pricing: mentor.pricing,
				hourlyRate: mentor.hourlyRate,
				availability: mentor.availability,
				documents: mentor.documents,
				createdAt: mentor.createdAt,
				lastActive: mentor.userId.lastActive,
			}));

			const total = mentors[0].total[0]?.count || 0;

			return { mentors: mentorDTOs, total };
		} catch (error) {
			throw handleError(error, "Error finding all mentors");
		}
	}

	async findAllApprovedMentors(): Promise<IMentorDTO[]> {
		try {
			const approvedMentors = await MentorProfileModel.find().populate({
				path: "userId",
				model: UserModel,
				match: {
					role: "mentor",
					mentorRequestStatus: "approved",
				},
			});

			const mentorDTOs: IMentorDTO[] = approvedMentors
				.filter((mentor: any) => mentor.userId)
				.map((mentor: any) => ({
					email: mentor.userId.email,
					password: mentor.userId.password,
					firstName: mentor.userId.firstName,
					role: mentor.userId.role,
					lastName: mentor.userId.lastName,
					avatar: mentor.userId.avatar,
					bio: mentor.userId.bio,
					interests: mentor.userId.interests,
					updatedAt: mentor.userId.updatedAt,
					skills: mentor.userId.skills,
					status: mentor.userId.status,
					mentorRequestStatus: mentor.userId.mentorRequestStatus,
					isVerified: mentor.userId.isVerified,
					averageRating: mentor.userId.averageRating,
					totalReviews: mentor.userId.totalReviews,
					sessionCompleted: mentor.userId.sessionCompleted,
					featuredMentor: mentor.userId.featuredMentor,
					badges: mentor.userId.badges,
					userId: mentor.userId._id,
					professionalTitle: mentor.professionalTitle,
					languages: mentor.languages,
					primaryExpertise: mentor.primaryExpertise,
					yearsExperience: mentor.yearsExperience,
					workExperiences: mentor.workExperiences,
					educations: mentor.educations,
					certifications: mentor.certifications,
					sessionFormat: mentor.sessionFormat,
					sessionTypes: mentor.sessionTypes,
					pricing: mentor.pricing,
					hourlyRate: mentor.hourlyRate,
					availability: mentor.availability,
					documents: mentor.documents,
					createdAt: mentor.createdAt,
					lastActive: mentor.userId.lastActive,
				}));

			return mentorDTOs;
		} catch (error) {
			throw handleError(error, "Error finding all approved mentors");
		}
	}

	async findMentorByUserId(userId: string): Promise<IMentorDTO | null> {
		try {
			const mentor = await MentorProfileModel.findOne({ userId }).populate("userId");
			if (!mentor || !mentor.userId) return null;

			const user = mentor.userId as any;

			const mentorDTOs: IMentorDTO = {
				email: user.email,
				password: user.password,
				firstName: user.firstName,
				role: user.role,
				lastName: user.lastName,
				avatar: user.avatar,
				bio: user.bio,
				interests: user.interests,
				updatedAt: user.updatedAt,
				skills: user.skills,
				status: user.status,
				mentorRequestStatus: user.mentorRequestStatus,
				isVerified: user.isVerified,
				averageRating: user.averageRating,
				totalReviews: user.totalReviews,
				sessionCompleted: user.sessionCompleted,
				featuredMentor: user.featuredMentor,
				badges: user.badges,
				userId: user._id,
				professionalTitle: mentor.professionalTitle,
				languages: mentor.languages,
				primaryExpertise: mentor.primaryExpertise,
				yearsExperience: mentor.yearsExperience,
				workExperiences: mentor.workExperiences,
				educations: mentor.educations,
				certifications: mentor.certifications,
				sessionFormat: mentor.sessionFormat,
				sessionTypes: mentor.sessionTypes,
				pricing: mentor.pricing,
				hourlyRate: mentor.hourlyRate,
				availability: mentor.availability,
				documents: mentor.documents,
				createdAt: mentor.createdAt,
				lastActive: user.lastActive,
			};

			return mentorDTOs;
		} catch (error) {
			throw handleError(error, "Error finding mentor by user ID");
		}
	}

	async getAvailability(userId: string): Promise<IAvailabilityDTO | null> {
		try {
			const result = await MentorProfileModel.findOne({ userId }, { availability: 1, _id: 0 }).lean();
			if (!result) return null;
			return { userId, availability: result.availability };
		} catch (error) {
			throw handleError(error, "Error finding mentor availability");
		}
	}
}

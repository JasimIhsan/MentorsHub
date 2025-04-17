import { IMentorDTO } from "../../../../application/dtos/mentor.dtos";
import { IMentorProfileRepository } from "../../../../domain/dbrepository/mentor.details.repository";
import { IMentorInterface, MentorProfileEntity } from "../../../../domain/entities/mentor.detailes.entity";
import { MentorProfileModel } from "../../models/user/mentor.details.model";
import { UserModel } from "../../models/user/user.model";

// Error handler
const handleError = (error: unknown, message: string): never => {
	console.error(`${message}:`, error);
	throw new Error(error instanceof Error ? error.message : message);
};

export class MentorDetailsRepositoryImpl implements IMentorProfileRepository {
	async findByUserId(userId: string): Promise<MentorProfileEntity | null> {
		console.log("userId in repository: ", userId);
		try {
			const result = await MentorProfileModel.findOne({ userId });
			return result ? MentorProfileEntity.fromDBDocument(result) : null;
		} catch (error) {
			return handleError(error, "Error finding mentor details by user ID");
		}
	}

	async updateByUserId(userId: string, updatedData: Partial<MentorProfileEntity>): Promise<MentorProfileEntity> {
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

	async findAllMentors(): Promise<IMentorDTO[]> {
		try {
			// Get all mentor profiles and populate the related user data
			const mentors = await MentorProfileModel.find().populate("userId");

			// Transform data to match the IMentorDTO structure
			const mentorDTOs: IMentorDTO[] = mentors.map((mentor: any) => ({
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
				rating: mentor.userId.rating,
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

			const mentorDTOs: IMentorDTO[] = approvedMentors.map((mentor: any) => ({
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
				rating: mentor.userId.rating,
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
}

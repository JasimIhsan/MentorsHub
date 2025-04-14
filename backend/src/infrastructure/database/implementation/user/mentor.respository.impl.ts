import { IMentorProfileRepository } from "../../../../domain/dbrepository/mentor.details.repository";
import { IMentorInterface, MentorProfileEntity } from "../../../../domain/entities/mentor.detailes.entity";
import { MentorProfileModel } from "../../models/user/mentor.details.model";

// Error handler
const handleError = (error: unknown, message: string): never => {
	console.error(`${message}:`, error);
	throw new Error(error instanceof Error ? error.message : message);
};

export class MentorDetailsRepositoryImpl implements IMentorProfileRepository {
	async findByUserId(userId: string): Promise<MentorProfileEntity | null> {
		console.log('userId in repository: ', userId);
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
}

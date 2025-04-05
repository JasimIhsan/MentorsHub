import { IMentorDetails } from "../../../../domain/entities/mentor.detailes.entity";
import { IMentorDetailsRepository } from "../../../../domain/dbrepository/mentor.details.repository";
import { MentorDetailsModel } from "../../models/user/mentor.details.model";
// Helper function for error handling
const handleError = (error: unknown, message: string): never => {
	console.error(`${message}:`, error);
	throw new Error(error instanceof Error ? error.message : message);
};

export class MentorDetailsRespositoryImpl implements IMentorDetailsRepository {
	async create(mentorDetails: IMentorDetails): Promise<IMentorDetails> {
		try {
			const createdMentorDetails = new MentorDetailsModel(mentorDetails);
			return await createdMentorDetails.save();
		} catch (error) {
			return handleError(error, "Error creating mentor details");
		}
	}

	async update(userId: string, data: Partial<IMentorDetails>): Promise<IMentorDetails | null> {
		try {
			return await MentorDetailsModel.findByIdAndUpdate(userId, data, { new: true });
		} catch (error) {
			return handleError(error, "Error updating mentor details");
		}
	}

	async findByUserId(userId: string): Promise<IMentorDetails | null> {
		try {
			return await MentorDetailsModel.findOne({ userId });
		} catch (error) {
			return handleError(error, "Error finding mentor details by user ID");
		}
	}
}

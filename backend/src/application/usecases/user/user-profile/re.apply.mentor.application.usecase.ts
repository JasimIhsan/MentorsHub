import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IMentorInterface, MentorProfileEntity } from "../../../../domain/entities/mentor.detailes.entity";
import { UserEntity, UserInterface } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IUploadMentorDocuments } from "../../../interfaces/documents";
import { IReApplyMentorApplicationUseCase } from "../../../interfaces/user/user.profile.usecase.interfaces";

export class ReApplyMentorApplicationUseCase implements IReApplyMentorApplicationUseCase {
	constructor(private mentorProfileRepo: IMentorProfileRepository, private userRepo: IUserRepository, private uploadDocumentUseCase: IUploadMentorDocuments) {}

	async execute(userId: string, data: IMentorInterface, userData: Partial<UserInterface>, documents: Express.Multer.File[]): Promise<{ savedUser: UserEntity; mentorProfile: MentorProfileEntity }> {
		const existingUser = await this.userRepo.findUserById(userId);
		if (!existingUser) throw new Error(CommonStringMessage.USER_NOT_FOUND);
		if (existingUser.getRole() === "mentor") {
			throw new Error("You are already a mentor");
		}
		if (existingUser.getMentorRequestStatus() === "pending" || existingUser.getMentorRequestStatus() === "approved") {
			throw new Error("Mentor request is already approved or in process");
		}

		let documentUrls: string[] = [];
		const existingProfile = await this.mentorProfileRepo.findByUserId(userId);

		// If documents are provided, upload them; otherwise, retain existing documents for rejected applications
		if (documents.length > 0) {
			documentUrls = await Promise.all(
				documents.map((document) =>
					this.uploadDocumentUseCase.execute({
						fileBuffer: document.buffer,
						fileName: document.originalname,
						mimeType: document.mimetype,
						mentorId: userId,
					})
				)
			);
		} else if (existingProfile && existingUser.getMentorRequestStatus() === "rejected") {
			documentUrls = existingProfile.getDocuments() || [];
		}

		const updateData: IMentorInterface = {
			...data,
			hourlyRate: Number(data.hourlyRate),
			documents: documentUrls,
		};

		let mentorProfile: MentorProfileEntity;

		if (existingProfile && existingUser.getMentorRequestStatus() === "rejected") {
			// Update existing mentor profile for re-application
			existingProfile.updateMentorProfile(updateData);
			mentorProfile = await this.mentorProfileRepo.updateMentorProfile(userId, existingProfile);
		} else {
			// Create new mentor profile
			const newMentorProfile = new MentorProfileEntity(updateData);
			mentorProfile = await this.mentorProfileRepo.createMentorProfile(userId, newMentorProfile);
		}

		// Update user details with pending status
		const updatedUserData: Partial<UserInterface> = {
			...userData,
			mentorRequestStatus: "pending",
		};

		const user = await this.userRepo.findUserById(userId);
		user?.updateUserDetails(updatedUserData);
		const savedUser = await this.userRepo.updateUser(userId, user as UserEntity);

		return { savedUser, mentorProfile };
	}
}

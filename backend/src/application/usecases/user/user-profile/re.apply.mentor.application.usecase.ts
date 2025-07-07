import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { MentorProfileProps, MentorProfileEntity } from "../../../../domain/entities/mentor.detailes.entity";
import { UserEntity, UserEntityProps } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IUploadMentorDocuments } from "../../../interfaces/documents";
import { IReApplyMentorApplicationUseCase } from "../../../interfaces/user/user.profile.usecase.interfaces";
import { RoleEnum } from "../../../interfaces/enums/role.enum";

export class ReApplyMentorApplicationUseCase implements IReApplyMentorApplicationUseCase {
	constructor(private mentorProfileRepo: IMentorProfileRepository, private userRepo: IUserRepository, private uploadDocumentUseCase: IUploadMentorDocuments) {}

	async execute(userId: string, data: MentorProfileProps, userData: Partial<UserEntityProps>, documents: Express.Multer.File[]): Promise<{ savedUser: UserEntity; mentorProfile: MentorProfileEntity }> {
		const userEntity = await this.userRepo.findUserById(userId);
		if (!userEntity) throw new Error(CommonStringMessage.USER_NOT_FOUND);
		if (userEntity.role === RoleEnum.MENTOR) {
			throw new Error("You are already a mentor");
		}
		if (userEntity.mentorRequestStatus === "pending" || userEntity.mentorRequestStatus === "approved") {
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
					}),
				),
			);
		} else if (existingProfile && userEntity.mentorRequestStatus === "rejected") {
			documentUrls = existingProfile.documents || [];
		}

		const updateData: MentorProfileProps = {
			...data,
			hourlyRate: Number(data.hourlyRate),
			documents: documentUrls,
		};

		let mentorProfile: MentorProfileEntity;

		if (existingProfile && userEntity.mentorRequestStatus === "rejected") {
			// Update existing mentor profile for re-application
			existingProfile.updateMentorProfile(updateData);
			mentorProfile = await this.mentorProfileRepo.updateMentorProfile(userId, existingProfile);
		} else {
			// Create new mentor profile
			const newMentorProfile = MentorProfileEntity.create(updateData);
			mentorProfile = await this.mentorProfileRepo.createMentorProfile(userId, newMentorProfile);
		}

		// Update user details with pending status
		const updatedUserData: Partial<UserEntityProps> = {
			...userData,
			mentorRequestStatus: "pending",
		};

		const user = await this.userRepo.findUserById(userId);
		user?.updateUserDetails(updatedUserData);
		const savedUser = await this.userRepo.updateUser(userId, user as UserEntity);

		return { savedUser, mentorProfile };
	}
}

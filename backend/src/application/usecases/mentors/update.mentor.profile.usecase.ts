import { MentorProfileProps } from "../../../domain/entities/mentor.detailes.entity";
import { UserEntity, UserEntityProps } from "../../../domain/entities/user.entity";
import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { CommonStringMessage } from "../../../shared/constants/string.messages";
import { IMentorDTO, mapToMentorDTO } from "../../dtos/mentor.dtos";
import { IUploadMentorDocuments } from "../../interfaces/usecases/documents";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";
import { RoleEnum } from "../../interfaces/enums/role.enum";
import { IUpdateMentorProfileUseCase } from "../../interfaces/usecases/mentors/mentor.profile.interfaces";
import { INotifyUserUseCase } from "../../interfaces/usecases/notification/notification.usecase";
import { ICloudinaryService } from "../../interfaces/usecases/user/user.profile.usecase.interfaces";

export class UpdateMentorProfileUseCase implements IUpdateMentorProfileUseCase {
	constructor(
		private mentorProfileRepo: IMentorProfileRepository, //
		private userRepo: IUserRepository,
		private uploadDocumentUseCase: IUploadMentorDocuments,
		private notifyUserUseCase: INotifyUserUseCase,
		private uploadAvatarUseCase: ICloudinaryService,
	) {}

	async execute(userId: string, mentorData: Partial<MentorProfileProps>, userData: Partial<UserEntityProps>, newDocuments?: Express.Multer.File[], newAvatar?: Express.Multer.File): Promise<IMentorDTO> {
		const userEntity: UserEntity | null = await this.userRepo.findUserById(userId);
		if (!userEntity) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		// Only mentors can update their profile
		if (userEntity.role !== RoleEnum.MENTOR) {
			throw new Error("Only mentors can update their profile.");
		}

		const existingProfile = await this.mentorProfileRepo.findByUserId(userId);
		console.log("existingProfile: ", existingProfile);
		if (!existingProfile) {
			throw new Error("Mentor profile not found.");
		}

		// Upload new documents if provided
		if (newDocuments && newDocuments.length > 0) {
			const uploadedUrls = await Promise.all(
				newDocuments.map((file) =>
					this.uploadDocumentUseCase.execute({
						fileBuffer: file.buffer,
						fileName: file.originalname,
						mimeType: file.mimetype,
						mentorId: userId,
					}),
				),
			);
			// Merge existing documents with new ones
			const existingDocuments = existingProfile.documents; 
			mentorData.documents = [...existingDocuments, ...uploadedUrls];
		}

		if (newAvatar) {
			const avatarUrl = await this.uploadAvatarUseCase.uploadProfilePicture(newAvatar);
			userData.avatar = avatarUrl;
		}

		console.log("mentorData : ", mentorData);
		console.log("userData : ", userData);

		userEntity.updateUserDetails(userData);
		await this.userRepo.updateUser(userEntity.id!, userEntity);

		// Update profile with partial fields
		existingProfile.updateMentorProfile(mentorData);

		// Save changes
		const mentorProfileEntity = await this.mentorProfileRepo.updateMentorProfile(userId, existingProfile);
		console.log("mentorProfileEntity: ", mentorProfileEntity);

		await this.notifyUserUseCase.execute({
			title: "👤 Profile Updated Successfully",
			message: "Your mentor profile has been successfully updated.",
			isRead: false,
			recipientId: userEntity.id!,
			type: NotificationTypeEnum.SUCCESS,
			link: "/mentor/profile",
		});

		return mapToMentorDTO(userEntity, mentorProfileEntity);
	}
}

import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { MentorProfileProps, MentorProfileEntity } from "../../../../domain/entities/mentor.detailes.entity";
import { UserEntityProps } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IUploadMentorDocuments } from "../../../interfaces/documents";
import { IBecomeMentorUseCase } from "../../../interfaces/user/user.profile.usecase.interfaces";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";

export class BecomeMentorUseCase implements IBecomeMentorUseCase {
	constructor(private mentorProfileRepo: IMentorProfileRepository, private userRepo: IUserRepository, private uploadDocumentUseCase: IUploadMentorDocuments) {}

	async execute(userId: string, data: MentorProfileProps, userData: Partial<UserEntityProps>, documents: Express.Multer.File[]): Promise<{ savedUser: IUserDTO; mentorProfile: MentorProfileEntity }> {
		const userEntity = await this.userRepo.findUserById(userId);
		if (!userEntity) throw new Error(CommonStringMessage.USER_NOT_FOUND);
		if (userEntity.role === "mentor") {
			throw new Error("You are already a mentor");
		}
		if (userEntity.mentorRequestStatus === "pending" || userEntity.mentorRequestStatus === "approved") {
			throw new Error("Mentor request is already approved or in process");
		}
		const existingProfile = await this.mentorProfileRepo.findByUserId(userId);
		if (existingProfile) {
			throw new Error("Mentor profile already exists");
		}

		let documentUrls: string[] = [];
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
		}

		const updateData: MentorProfileProps = {
			...data,
			hourlyRate: Number(data.hourlyRate),
			documents: documentUrls,
		};

		const newMentorProfile = MentorProfileEntity.create(updateData);

		const mentorProfile = await this.mentorProfileRepo.createMentorProfile(userId, newMentorProfile);

		const updatedUserData: Partial<UserEntityProps> = {
			...userData,
			mentorRequestStatus: "pending",
		};

		userEntity?.updateUserDetails(updatedUserData);
		await this.userRepo.updateUser(userId, userEntity);

		const user = mapToUserDTO(userEntity);
		return { savedUser: user, mentorProfile };
	}
}

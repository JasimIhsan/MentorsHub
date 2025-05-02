import { exitCode } from "process";
import { UserEntity, UserInterface } from "../../../domain/entities/user.entity";
import { IMentorInterface, MentorProfileEntity } from "../../../domain/entities/mentor.detailes.entity";

export interface IUpdateUserProfileUseCase {
	execute(userId: string, data: Partial<UserInterface>, imageUrl?: string): Promise<UserEntity>;
}

export interface ICloudinaryService {
	uploadProfilePicture(file: Express.Multer.File): Promise<string>;
}

export interface IChangePasswordUseCase {
	execute(userId: string, oldPassword: string, newPassword: string): Promise<UserEntity | null>;
}
export interface IBecomeMentorUseCase {
	execute(
		userId: string,
		data: Omit<IMentorInterface, "documents">,
		userData: Partial<UserInterface>,
		documents: Express.Multer.File[]
	): Promise<{
		savedUser: UserEntity;
		mentorProfile: MentorProfileEntity;
	}>;
}

export interface IGetUserProfileUseCase {
	execute(userId: string): Promise<UserEntity | null>;
}
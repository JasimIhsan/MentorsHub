import { UserEntity, UserEntityProps } from "../../../domain/entities/user.entity";
import { IMentorInterface, MentorProfileEntity } from "../../../domain/entities/mentor.detailes.entity";
import { IUserDTO } from "../../dtos/user.dtos";

export interface IUpdateUserProfileUseCase {
	execute(userId: string, data: Partial<UserEntityProps>, imageUrl?: string): Promise<UserEntity>;
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
		userData: Partial<UserEntityProps>,
		documents: Express.Multer.File[]
	): Promise<{
		savedUser: IUserDTO;
		mentorProfile: MentorProfileEntity;
	}>;
}

export interface IReApplyMentorApplicationUseCase {
	execute(
		userId: string,
		data: Omit<IMentorInterface, "documents">,
		userData: Partial<UserEntityProps>,
		documents: Express.Multer.File[]
	): Promise<{
		savedUser: UserEntity;
		mentorProfile: MentorProfileEntity;
	}>;
}

export interface IGetUserProfileUseCase {
	execute(userId: string): Promise<IUserDTO | null>;
}

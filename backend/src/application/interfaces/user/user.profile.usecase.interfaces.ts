import { UserEntity, UserInterface } from "../../../domain/entities/user.entity";

export interface IUpdateUserProfileUseCase {
	execute(userId: string, data: Partial<UserInterface>, imageUrl?: string): Promise<UserEntity>;
}

export interface ICloudinaryService {
	uploadProfilePicture(file: Express.Multer.File): Promise<string>;
}

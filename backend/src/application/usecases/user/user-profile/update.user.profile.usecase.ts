import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { UserEntity, UserInterface } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { ICloudinaryService, IUpdateUserProfileUseCase } from "../../../interfaces/user/user.profile.usecase.interfaces";

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
	constructor(private userRepo: IUserRepository) {}

	async execute(userId: string, data: Partial<UserInterface>, imageUrl?: string) {
		console.log('userId: ', userId);

		const existingUser = await this.userRepo.findUserById(userId);
		if (!existingUser) {
			throw new Error(CommonStringMessage.USER_NOT_FOUND);
		}

		if (imageUrl) {
			data.avatar = imageUrl;
		}

		existingUser.updateUserDetails(data);
		await this.userRepo.save(existingUser);

		return existingUser;
	}
}

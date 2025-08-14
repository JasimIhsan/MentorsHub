import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UserEntityProps } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IUpdateUserProfileUseCase } from "../../../interfaces/usecases/user/user.profile.usecase.interfaces";
import { mapToUserDTO } from "../../../dtos/user.dtos";

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
	constructor(private userRepo: IUserRepository) {}

	async execute(userId: string, data: Partial<UserEntityProps>, imageUrl?: string) {
		const existingUser = await this.userRepo.findUserById(userId);
		if (!existingUser) {
			throw new Error(CommonStringMessage.USER_NOT_FOUND);
		}

		if (imageUrl) {
			data.avatar = imageUrl;
		}

		existingUser.updateUserDetails(data);
		await this.userRepo.save(existingUser);

		return mapToUserDTO(existingUser);
	}
}

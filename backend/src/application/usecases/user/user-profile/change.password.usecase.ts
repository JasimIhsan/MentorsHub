import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IChangePasswordUseCase } from "../../../interfaces/user/user.profile.usecase.interfaces";

export class ChangePasswordUsecase implements IChangePasswordUseCase {
	constructor(private userRepo: IUserRepository) {}
	async execute(userId: string, oldPassword: string, newPassword: string) {
		const user = await this.userRepo.findUserById(userId);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		const isPasswordValid = await user.isPasswordValid(oldPassword);
		if (!isPasswordValid) throw new Error("Invalid current password");

		const isSamePassword = await user.isPasswordValid(newPassword);
		if (isSamePassword) {
			throw new Error("Password cannot be the same as the old password");
		}

		const hashedPassword = await UserEntity.hashPassword(newPassword);
		user.updateUserDetails({ password: hashedPassword });

		return await this.userRepo.updateUser(userId, user);
	}
}

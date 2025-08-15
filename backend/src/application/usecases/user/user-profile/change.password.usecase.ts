import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IChangePasswordUseCase } from "../../../interfaces/usecases/user/user.profile.usecase.interfaces";
import { IHashService } from "../../../interfaces/services/hash.service";

export class ChangePasswordUsecase implements IChangePasswordUseCase {
	constructor(private userRepo: IUserRepository, private hashService: IHashService) {}
	async execute(userId: string, oldPassword: string, newPassword: string) {
		const user = await this.userRepo.findUserById(userId);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		const isPasswordValid = await this.hashService.comparePassword(oldPassword, user.password);
		if (!isPasswordValid) throw new Error("Invalid current password");

		const isSamePassword = await this.hashService.comparePassword(newPassword, user.password);
		if (isSamePassword) {
			throw new Error("Password cannot be the same as the old password");
		}

		const hashedPassword = await this.hashService.hashPassword(newPassword);
		user.updateUserDetails({ password: hashedPassword });

		return await this.userRepo.updateUser(userId, user);
	}
}

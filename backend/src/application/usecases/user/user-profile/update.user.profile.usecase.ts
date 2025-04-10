import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { UserEntity, UserInterface } from "../../../../domain/entities/user.entity";
import { IUpdateUserProfileUseCase } from "../../../interfaces/user/user.profile.usecase.interfaces";

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
	constructor(private userRepo: IUserRepository) {}

	async execute(userId: string, data: Partial<UserInterface>) {
		const existingUser = await this.userRepo.findUserById(userId);
		if (!existingUser) {
			throw new Error("User not found");
		}

		console.log(`Data : `, data);

		existingUser.updateUserDetails(data);
		await this.userRepo.save(existingUser);
		console.log(`saved user : `, existingUser);

		return existingUser;
	}
}

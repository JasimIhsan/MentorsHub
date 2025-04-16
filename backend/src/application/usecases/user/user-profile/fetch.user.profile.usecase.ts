import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { IFetchUserProfileUseCase } from "../../../interfaces/user/user.profile.usecase.interfaces";

export class FetchUserProfileUseCase implements IFetchUserProfileUseCase {
	constructor(private userRepo: IUserRepository) {}

	async execute(userId: string): Promise<UserEntity | null> {
		const user = await this.userRepo.findUserById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}
}

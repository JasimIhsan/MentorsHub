import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IGetUserProfileUseCase } from "../../../interfaces/user/user.profile.usecase.interfaces";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";

export class GetUserProfileUseCase implements IGetUserProfileUseCase {
	constructor(private userRepo: IUserRepository) {}

	async execute(userId: string): Promise<IUserDTO | null> {
		const userEntity = await this.userRepo.findUserById(userId);
		if (!userEntity) {
			throw new Error(CommonStringMessage.USER_NOT_FOUND);
		}
		return mapToUserDTO(userEntity);
	}
}

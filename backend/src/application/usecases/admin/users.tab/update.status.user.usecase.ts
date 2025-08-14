import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";
import { IUpdateUserStatusUsecase } from "../../../interfaces/usecases/admin/admin.usertab.interfaces";
import { UserStatusEnums } from "../../../interfaces/enums/user.status.enums";

export class UpdateUserStatusUsecase implements  IUpdateUserStatusUsecase{
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(userId: string): Promise<IUserDTO> {
		const user = await this.userRepository.findUserById(userId);
		if (!user) {
			throw new Error(CommonStringMessage.USER_NOT_FOUND);
		}

		user.toggleStatus(user.status === UserStatusEnums.BLOCKED ? UserStatusEnums.UNBLOCKED : UserStatusEnums.BLOCKED);
		const updatedUser = await this.userRepository.updateUser(userId, user);
		if (!updatedUser) {
			throw new Error("Failed to update user.status");
		}
		return mapToUserDTO(updatedUser);
	}
}

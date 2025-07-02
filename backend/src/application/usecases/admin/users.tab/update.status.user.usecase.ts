import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";
import { IUpdateUserStatusUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";

export class UpdateUserStatusUsecase implements  IUpdateUserStatusUsecase{
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(userId: string): Promise<IUserDTO> {
		const user = await this.userRepository.findUserById(userId);
		if (!user) {
			throw new Error(CommonStringMessage.USER_NOT_FOUND);
		}

		user.toggleStatus(user.status === "blocked" ? "unblocked" : "blocked");
		const updatedUser = await this.userRepository.updateUser(userId, user);
		if (!updatedUser) {
			throw new Error("Failed to update user.status");
		}
		return mapToUserDTO(updatedUser);
	}
}

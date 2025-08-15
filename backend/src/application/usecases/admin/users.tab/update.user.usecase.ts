import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";
import { IUpdateUserUsecase } from "../../../interfaces/usecases/admin/admin.usertab.interfaces";

export class UpdateUserUsecase implements IUpdateUserUsecase {
	constructor(private userRepo: IUserRepository) {}

	async execute(userId: string, data: Partial<IUserDTO>) {
		const user = await this.userRepo.findUserById(userId);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		user.updateUserDetails(data);

		const updatedUser = await this.userRepo.updateUser(userId, user);

		return mapToUserDTO(updatedUser);
	}
}

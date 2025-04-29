import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IUserDTO } from "../../../dtos/user.dtos";
import { IUpdateUserUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";

export class UpdateUserUsecase implements IUpdateUserUsecase {
	constructor(private userRepo: IUserRepository) {}

	async execute(userId: string, data: Partial<IUserDTO>) {
		const user = await this.userRepo.findUserById(userId);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);
		
		user.updateUserDetails(data);

		return (await this.userRepo.updateUser(userId, user)) as UserEntity;
	}
}

import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { UserDTO } from "../../../dtos/user.dtos";
import { IUpdateUserUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";

export class UpdateUserStatusUsecase implements IUpdateUserUsecase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(userId: string): Promise<UserDTO> {
		const user = await this.userRepository.findUserById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		user.toggleStatus(user.getStatus() === "blocked" ? "unblocked" : "blocked");
		const updatedUser = await this.userRepository.updateUser(user);
		if (!updatedUser) {
			throw new Error("Failed to update user status");
		}
		return UserDTO.fromEntity(updatedUser);
	}
}

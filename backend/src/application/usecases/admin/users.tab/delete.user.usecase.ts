import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IDeleteUserUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";

export class DeleteUserUseCase implements IDeleteUserUsecase {
	constructor(private userRepo: IUserRepository) {}
	async execute(userId: string): Promise<void> {
		try {
			const res = await this.userRepo.deleteUser(userId);
			if (!res) {
				throw new Error(CommonStringMessage.USER_NOT_FOUND);
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
		}
	}
}

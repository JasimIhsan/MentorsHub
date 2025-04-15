import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { IDeleteUserUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";

export class DeleteUserUseCase implements IDeleteUserUsecase {
	constructor(private userRepo: IUserRepository) {}
	async execute(userId: string): Promise<void> {
		try {
			const res = await this.userRepo.deleteUser(userId);
			if (!res) {
				throw new Error("User not found");
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("Internal Server Error");
		}
	}
}

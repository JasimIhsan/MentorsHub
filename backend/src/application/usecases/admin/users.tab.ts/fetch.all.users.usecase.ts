import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { IFetchAllUsersUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";

export class FetchAllUsersUsecase implements IFetchAllUsersUsecase{
	constructor(private userRepository: IUserRepository) {}
	async execute(): Promise<any> {
		try {
			const users = await this.userRepository.findAllUsers();
			return users;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("An error occurred while fetching users");
		}
	}
}
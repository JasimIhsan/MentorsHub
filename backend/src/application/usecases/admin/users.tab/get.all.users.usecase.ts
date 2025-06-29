import { FindUsersParams, IUserRepository, PaginatedUsers } from "../../../../domain/repositories/user.repository";
import { IUserDTO } from "../../../dtos/user.dtos";
import { IGetAllUsersUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";

export class GetAllUsersUsecase implements IGetAllUsersUsecase {
	constructor(private userRepository: IUserRepository) {}
	async execute(params: FindUsersParams): Promise<PaginatedUsers> {
		try {
			const users = await this.userRepository.findAllUsers(params);
			return users;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("An error occurred while geting users");
		}
	}
}

import { FindUsersParams, IUserRepository, PaginatedUsers } from "../../../../domain/repositories/user.repository";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";
import { IGetAllUsersUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";

export class GetAllUsersUsecase implements IGetAllUsersUsecase {
	constructor(private userRepository: IUserRepository) {}
	async execute(params: FindUsersParams): Promise<{
		users: IUserDTO[];
		totalUsers: number;
		totalPages: number;
		currentPage: number;
	}> {
		try {
			const users = await this.userRepository.findAllUsers(params);

			const usersDtos: IUserDTO[] = users.users.map((user) => mapToUserDTO(user));
			return { ...users, users: usersDtos };
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("An error occurred while geting users");
		}
	}
}

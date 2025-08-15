import { FindUsersParams, IUserRepository } from "../../../../domain/repositories/user.repository";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";
import { IGetAllUsersUsecase } from "../../../interfaces/usecases/admin/admin.usertab.interfaces";

export class GetAllUsersUsecase implements IGetAllUsersUsecase {
	constructor(private userRepository: IUserRepository) {}
	async execute(params: FindUsersParams): Promise<{
		users: IUserDTO[];
		totalUsers: number;
		totalPages: number;
		currentPage: number;
	}> {
		try {
			const { currentPage, totalPages, totalUsers, userEntities } = await this.userRepository.findUsers(params);

			const usersDtos: IUserDTO[] = userEntities.map((user) => mapToUserDTO(user));
			return { currentPage, totalPages, totalUsers, users: usersDtos };
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("An error occurred while geting users");
		}
	}
}

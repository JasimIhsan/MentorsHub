import { UserEntity } from "../../../domain/entities/user.entity";
import { IUserDTO } from "../../dtos/user.dtos";

export interface IFetchAllUsersUsecase {
	execute(): Promise<IUserDTO[]>;
}
export interface ICreateUserUsecase {
	execute(user: UserEntity): Promise<UserEntity>;
}
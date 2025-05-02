import { UserEntity } from "../../../domain/entities/user.entity";
import { IUserDTO } from "../../dtos/user.dtos";

export interface IGetAllUsersUsecase {
	execute(): Promise<IUserDTO[]>;
}
export interface ICreateUserUsecase {
	execute(firstName: string, lastName: string, email: string, role: string): Promise<IUserDTO>;
}

export interface IUpdateUserStatusUsecase {
	execute(userId: string): Promise<IUserDTO>;
}

export interface IDeleteUserUsecase {
	execute(userId: string): Promise<void>;
}

export interface IUpdateUserUsecase {
	execute(userId: string, data: Partial<IUserDTO>): Promise<UserEntity>;
}

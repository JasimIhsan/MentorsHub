import { IUserDTO } from "../../application/dtos/user.dtos";
import { UserEntity, UserInterface } from "../entities/user.entity";

export interface FindUsersParams {
	page: number;
	limit: number;
	search?: string;
	role?: string;
	status?: string;
	sortBy?: "fullName" | "createdAt";
	sortOrder?: "asc" | "desc";
}

export interface PaginatedUsers {
	users: UserEntity[];
	totalUsers: number;
	totalPages: number;
	currentPage: number;
}

export interface IUserRepository {
	createUser(user: UserEntity): Promise<UserEntity>;
	findUserById(id: string): Promise<UserEntity | null>;
	findUserByEmail(email: string): Promise<UserEntity | null>;
	save(user: UserEntity): Promise<void>;
	findAllUsers(params: FindUsersParams): Promise<PaginatedUsers>;
	updateUser(userId: string, user: UserEntity): Promise<UserEntity>;
	deleteUser(id: string): Promise<void | null>;
}

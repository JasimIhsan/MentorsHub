import { UserEntity, UserInterface } from "../entities/user.entity";

export interface IUserRepository {
	createUser(user: UserEntity): Promise<UserEntity>;
	findUserById(id: string): Promise<UserInterface | null>;
	findUserByEmail(email: string): Promise<UserInterface | null>;
}

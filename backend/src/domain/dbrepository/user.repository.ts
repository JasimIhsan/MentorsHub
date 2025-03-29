import { UserEntity, UserInterface } from "../entities/user.entity";

export interface IUserRepository {
	createUser(user: UserEntity): Promise<UserEntity>;
	findUserById(id: string): Promise<UserEntity | null>;
	findUserByEmail(email: string): Promise<UserEntity | null>;
	findUserByResetToken(token: string): Promise<UserEntity | null>;
	save(user: UserEntity): Promise<void>;
}

import { UserEntity, UserInterface } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repository/user.repository";
import { UserModel } from "../models/user.model";

// Helper function for error handling
const handleError = (error: unknown, message: string): never => {
	console.error(`${message}:`, error);
	throw new Error(error instanceof Error ? error.message : message);
};

export class UserRepositoryImpl implements IUserRepository {
	async createUser(user: UserEntity): Promise<UserEntity> {
		try {
			const newUser = new UserModel(user);
			const savedUser = await newUser.save()
			return new UserEntity(savedUser);
		} catch (error) {
			return handleError(error, "Error creating user");
		}
	}

	async findUserByEmail(email: string): Promise<UserInterface | null> {
		try {
			return await UserModel.findOne({ email });
		} catch (error) {
			return handleError(error, "Error finding user by email");
		}
	}

	async findUserById(id: string): Promise<UserInterface | null> {
		try {
			return await UserModel.findById(id);
		} catch (error) {
			return handleError(error, "Error finding user by ID");
		}
	}
}

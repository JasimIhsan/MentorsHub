import { UserEntity, UserInterface } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/dbrepository/user.repository";
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
			const savedUser = await newUser.save();
			return UserEntity.fromDBDocument(savedUser);
		} catch (error) {
			return handleError(error, "Error creating user");
		}
	}

	async findUserByEmail(email: string): Promise<UserEntity | null> {
		try {
			const userDoc = await UserModel.findOne({ email });
			return UserEntity.fromDBDocument(userDoc);
		} catch (error) {
			return handleError(error, "Error finding user by email");
		}
	}

	async findUserById(id: string): Promise<UserEntity | null> {
		try {
			const userDoc = await UserModel.findById(id);
			return UserEntity.fromDBDocument(userDoc);
		} catch (error) {
			return handleError(error, "Error finding user by ID");
		}
	}

	async findUserByResetToken(token: string): Promise<UserEntity | null> {
		try {
			const userDoc = await UserModel.findOne({ resetPasswordToken: token });
			if (!userDoc) return null;
			return UserEntity.fromDBDocument(userDoc);
		} catch (error) {
			return handleError(error, "Error finding user by reset token");
		}
	}

	async save(user: UserEntity): Promise<void> {
		await UserModel.updateOne({ _id: user.getId() }, user.getProfile(), { upsert: true });
	}
}

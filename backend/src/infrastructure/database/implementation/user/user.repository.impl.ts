import { UserEntity, UserInterface } from "../../../../domain/entities/user.entity";
import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { UserModel } from "../../models/user/user.model";
import mongoose from "mongoose";
import { IUserDTO, UserDTO } from "../../../../application/dtos/user.dtos";

// Helper function for error handling
export const handleError = (error: unknown, message: string): never => {
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
			return userDoc ? UserEntity.fromDBDocument(userDoc) : null;
		} catch (error) {
			return handleError(error, "Error finding user by email");
		}
	}

	async findUserById(id: string): Promise<UserEntity | null> {
		try {
			if (!mongoose.Types.ObjectId.isValid(id)) return null; // Validate MongoDB ObjectId
			const userDoc = await UserModel.findById(id);
			return userDoc ? UserEntity.fromDBDocument(userDoc) : null;
		} catch (error) {
			return handleError(error, "Error finding user by ID");
		}
	}

	async save(user: UserEntity): Promise<void> {
		try {
			await UserModel.findByIdAndUpdate(user.getId(), user.getProfile(true), { upsert: true, new: true });
		} catch (error) {
			handleError(error, "Error saving user");
		}
	}

	async findAllUsers(): Promise<IUserDTO[]> {
		try {
			const userDocs = await UserModel.find();
			const usersData: UserEntity[] = userDocs.map((doc) => UserEntity.fromDBDocument(doc));
			return usersData.map((user: UserEntity) => UserDTO.fromEntity(user));
		} catch (error) {
			return handleError(error, "Error fetching all users");
		}
	}

	async updateUser(user: UserEntity): Promise<UserEntity | null> {
		try {
			const updatedUser = await UserModel.findByIdAndUpdate(user.getId(), user.getProfile(true), { new: true });
			return updatedUser ? UserEntity.fromDBDocument(updatedUser) : null;
		} catch (error) {
			return handleError(error, "Error updating user");
		}
	}
}

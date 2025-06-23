import { UserEntity } from "../../../domain/entities/user.entity";
import { FindUsersParams, IUserRepository, PaginatedUsers } from "../../../domain/repositories/user.repository";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { UserModel } from "../models/user/user.model";
import mongoose from "mongoose";


export class UserRepositoryImpl implements IUserRepository {
	async createUser(user: UserEntity): Promise<UserEntity> {
		try {
			const newUser = new UserModel(user);
			const savedUser = await newUser.save();
			return UserEntity.fromDBDocument(savedUser);
		} catch (error) {
			return handleExceptionError(error, "Error creating user");
		}
	}

	async findUserByEmail(email: string): Promise<UserEntity | null> {
		try {
			const userDoc = await UserModel.findOne({ email });
			return userDoc ? UserEntity.fromDBDocument(userDoc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding user by email");
		}
	}

	async findUserById(id: string): Promise<UserEntity | null> {
		try {
			if (!mongoose.Types.ObjectId.isValid(id)) return null; // Validate MongoDB ObjectId
			const userDoc = await UserModel.findById(id);
			return userDoc ? UserEntity.fromDBDocument(userDoc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding user by ID");
		}
	}
	async save(user: UserEntity): Promise<void> {
		try {
			await UserModel.findByIdAndUpdate(user.getId(), user.getProfile(true), { upsert: true, new: true });
		} catch (error) {
			handleExceptionError(error, "Error saving user");
		}
	}

	async findAllUsers(params: FindUsersParams): Promise<PaginatedUsers> {
		try {
			const { page = 1, limit = 10, search, role, status, sortBy = "createdAt", sortOrder = "desc" } = params;

			// Build MongoDB query
			const query: any = {};
			if (search) {
				query.$or = [{ firstName: { $regex: search, $options: "i" } }, { lastName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
			}
			if (role) {
				query.role = role;
			}
			if (status) {
				query.status = status;
			}

			// Build sort options
			const sortOptions: { [key: string]: 1 | -1 } = {};
			sortOptions[sortBy === "fullName" ? "fullName" : "createdAt"] = sortOrder === "asc" ? 1 : -1;

			// Fetch paginated users
			const userDocs = await UserModel.find(query)
				.sort(sortOptions)
				.skip((page - 1) * limit)
				.limit(limit)
				.lean(); // Use lean for better performance (returns plain JS objects)

			// Map to UserEntity
			const users = userDocs.map((doc) => UserEntity.fromDBDocument(doc));

			// Get total count for pagination
			const totalUsers = await UserModel.countDocuments(query);
			const totalPages = Math.ceil(totalUsers / limit);

			return {
				users,
				totalUsers,
				totalPages,
				currentPage: page,
			};
		} catch (error) {
			return handleExceptionError(error, "Error getting all users");
		}
	}

	async updateUser(userId: string, user: UserEntity): Promise<UserEntity> {
		try {
			const updatedUser = await UserModel.findByIdAndUpdate(userId, user.getProfile(true), { new: true });
			console.log('updatedUser: ', updatedUser);
			return UserEntity.fromDBDocument(updatedUser);
		} catch (error) {
			return handleExceptionError(error, "Error updating user");
		}
	}

	async deleteUser(id: string): Promise<void | null> {
		try {
			return await UserModel.findByIdAndDelete(id);
		} catch (error) {
			handleExceptionError(error, "Error deleting user");
		}
	}
}

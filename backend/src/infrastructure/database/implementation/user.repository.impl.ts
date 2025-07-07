import { UserEntity } from "../../../domain/entities/user.entity";
import { FindUsersParams, IUserRepository, PaginatedUsers } from "../../../domain/repositories/user.repository";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { IUsersDocument, UserModel } from "../models/user/user.model";
import mongoose from "mongoose";

/**
 * Helper to convert raw Mongo document (lean object) ➜ UserEntityProps
 * Ensures array fields are converted to string[] to satisfy UserEntity typings.
 */

const mapDocToEntity = (doc: IUsersDocument): UserEntity => {
	return new UserEntity({
		id: doc._id.toString(),
		email: doc.email,
		password: doc.password,
		firstName: doc.firstName,
		lastName: doc.lastName,
		role: doc.role,
		avatar: doc.avatar ?? null,
		bio: doc.bio ?? null,
		interests: doc.interests?.map(String) ?? null,
		skills: doc.skills?.map(String) ?? null,
		status: doc.status,
		mentorRequestStatus: doc.mentorRequestStatus,
		googleId: doc.googleId ?? null,
		sessionCompleted: doc.sessionCompleted ?? 0,
		averageRating: doc.averageRating ?? null,
		totalReviews: doc.totalReviews ?? null,
		badges: doc.badges?.map((b) => b.toString()) ?? null,
		createdAt: doc.createdAt,
		updatedAt: doc.updatedAt ?? null,
	});
};

export class UserRepositoryImpl implements IUserRepository {
	async createUser(user: UserEntity): Promise<UserEntity> {
		try {
			const newUser = new UserModel(user.toObject());
			const saved = await newUser.save();
			return mapDocToEntity(saved.toObject());
		} catch (error) {
			return handleExceptionError(error, "Error creating user");
		}
	}

	async findUserByEmail(email: string): Promise<UserEntity | null> {
		try {
			const doc = await UserModel.findOne({ email }).lean();
			return doc ? mapDocToEntity(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding user by email");
		}
	}

	async findUserById(id: string): Promise<UserEntity | null> {
		try {
			if (!mongoose.Types.ObjectId.isValid(id)) return null;
			const doc = await UserModel.findById(id).lean();
			return doc ? mapDocToEntity(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding user by ID");
		}
	}

	async save(user: UserEntity): Promise<void> {
		try {
			await UserModel.findByIdAndUpdate(user.id, user.toObject(), { upsert: true });
		} catch (error) {
			handleExceptionError(error, "Error saving user");
		}
	}

	async findUsers(params: FindUsersParams): Promise<PaginatedUsers> {
		try {
			const { page = 1, limit = 10, search, role, status, sortBy = "createdAt", sortOrder = "desc" } = params;

			const query: any = {};
			if (search) {
				const regex = { $regex: search, $options: "i" };
				query.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
			}
			if (role) query.role = role;
			if (status) query.status = status;

			const sortOptions: { [key: string]: 1 | -1 } = {};
			sortOptions[sortBy === "fullName" ? "firstName" : sortBy] = sortOrder === "asc" ? 1 : -1;

			const docs = await UserModel.find(query)
				.sort(sortOptions)
				.skip((page - 1) * limit)
				.limit(limit)
				.lean();

			const users = docs.map(mapDocToEntity);
			const totalUsers = await UserModel.countDocuments(query);
			const totalPages = Math.ceil(totalUsers / limit);

			return { userEntities: users, totalUsers, totalPages, currentPage: page };
		} catch (error) {
			return handleExceptionError(error, "Error getting all users");
		}
	}

	async updateUser(userId: string, user: UserEntity): Promise<UserEntity> {
		try {
			const updated = await UserModel.findByIdAndUpdate(userId, user.toObject(), { new: true }).lean();
			if (!updated) throw new Error("User not found");
			return mapDocToEntity(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating user");
		}
	}

	async deleteUser(id: string): Promise<void | null> {
		try {
			await UserModel.findByIdAndDelete(id);
		} catch (error) {
			handleExceptionError(error, "Error deleting user");
		}
	}

	async findUsersByIds(ids: string[]): Promise<UserEntity[]> {
		try {
			const docs = await UserModel.find({ _id: { $in: ids } }).lean();
			return docs.map(mapDocToEntity);
		} catch (error) {
			return handleExceptionError(error, "Error finding users by IDs");
		}
	}

	// async findMentors(params: { page?: number; limit?: number; search?: string }): Promise<PaginatedUsers> {
	// 	try {
	// 		const { page = 1, limit = 12, search } = params;

	// 		const query: any = {
	// 			mentorRequestStatus: "approved",
	// 			role: "mentor",
	// 		};

	// 		// Handle search: matches `name` or `headline` using regex
	// 		if (search) {
	// 			const regex = new RegExp(search, "i");
	// 			query.$or = [{ firstName: regex }, { lastName: regex }];
	// 		}

	// 		// STEP 1: Get all matching users
	// 		const totalUsers = await UserModel.countDocuments(query);

	// 		let mongoQuery = UserModel.find(query);

	// 		// Pagination
	// 		const skip = (page - 1) * limit;
	// 		mongoQuery = mongoQuery.skip(skip).limit(limit);

	// 		const users = await mongoQuery.exec();

	// 		return {
	// 			userEntities: users.map(mapDocToEntity),
	// 			currentPage: page,
	// 			totalPages: Math.ceil(totalUsers / limit),
	// 			totalUsers,
	// 		};
	// 	} catch (error) {
	// 		handleExceptionError(error, "Error finding mentors");
	// 		throw error;
	// 	}
	// }
}

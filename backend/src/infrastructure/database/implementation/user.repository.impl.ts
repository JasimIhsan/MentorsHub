import { MentorRequestStatusEnum } from "../../../application/interfaces/enums/mentor.request.status.enum";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
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

	countMentors(): Promise<number> {
		try {
			return UserModel.countDocuments({ role: RoleEnum.MENTOR, mentorRequestStatus: MentorRequestStatusEnum.APPROVED });
		} catch (error) {
			return handleExceptionError(error, "Error counting mentors");
		}
	}

	async countUsers(): Promise<number> {
		try {
			return await UserModel.countDocuments();
		} catch (error) {
			return handleExceptionError(error, "Error counting users");
		}
	}

	async userGrowthChartData(months: number): Promise<{ users: number; mentors: number; name: string }[]> {
		try {
			const matchFilter: any = {
				role: { $in: [RoleEnum.USER, RoleEnum.MENTOR] },
			};

			const now = new Date();

			// Add date filter based on the selected range
			if (months === 1) {
				matchFilter.createdAt = {
					$gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
				};
			} else if (months > 1) {
				matchFilter.createdAt = {
					$gte: new Date(now.getFullYear(), now.getMonth() - months, now.getDate()),
				};
			}

			const userGrowthData = await UserModel.aggregate([
				{ $match: matchFilter },
				{
					$group: {
						_id: {
							year: { $year: "$createdAt" },
							month: { $month: "$createdAt" },
							day: { $dayOfMonth: "$createdAt" },
							role: "$role",
						},
						count: { $sum: 1 },
					},
				},
				{
					$group: {
						_id: {
							year: "$_id.year",
							month: "$_id.month",
							day: "$_id.day",
						},
						users: {
							$sum: {
								$cond: [{ $in: ["$_id.role", [RoleEnum.USER, RoleEnum.MENTOR]] }, "$count", 0],
							},
						},
						mentors: {
							$sum: {
								$cond: [{ $eq: ["$_id.role", RoleEnum.MENTOR] }, "$count", 0],
							},
						},
					},
				},
				{
					$project: {
						name: {
							$concat: [{ $toString: "$_id.day" }, "-", { $toString: "$_id.month" }, "-", { $toString: "$_id.year" }],
						},
						users: 1,
						mentors: 1,
						sortDate: {
							$dateFromParts: {
								year: "$_id.year",
								month: "$_id.month",
								day: "$_id.day",
							},
						},
						_id: 0,
					},
				},
				{ $sort: { sortDate: 1 } },
				{ $project: { name: 1, users: 1, mentors: 1 } },
			]);

			return userGrowthData;
		} catch (error) {
			return handleExceptionError(error, "Error fetching user growth chart data");
		}
	}
}

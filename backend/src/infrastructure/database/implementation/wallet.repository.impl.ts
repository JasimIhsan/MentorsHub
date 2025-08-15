import { WalletModel } from "../models/wallet/wallet.model";
import { WalletTransactionModel } from "../models/wallet/wallet.transaction.model";
import { WithdrawalRequestModel } from "../models/wallet/wallet.withdrawel.request.model";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { WalletEntity } from "../../../domain/entities/wallet/wallet.entity";
import { WithdrawalRequestEntity } from "../../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { AdminModel } from "../models/admin/admin.model";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { WalletTransactionEntity } from "../../../domain/entities/wallet/wallet.transaction.entity";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { TransactionMethodEnum, TransactionsTypeEnum } from "../../../application/interfaces/enums/transaction.type.enum";
import mongoose from "mongoose";
import { TransactionPurposeEnum } from "../../../application/interfaces/enums/transaction.purpose.enum";

export class WalletRepositoryImpl implements IWalletRepository {
	async findWalletByUserId(userId: string): Promise<WalletEntity | null> {
		try {
			const doc = await WalletModel.findOne({ userId });
			return doc ? WalletEntity.fromDBDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding wallet by userId");
		}
	}

	async createWallet(userId: string, role: RoleEnum): Promise<WalletEntity> {
		try {
			const doc = await WalletModel.create({ userId, balance: 0, role });
			return WalletEntity.fromDBDocument(doc);
		} catch (error) {
			return handleExceptionError(error, "Error creating wallet");
		}
	}

	async platformWallet(): Promise<WalletEntity> {
		try {
			const admin = await AdminModel.findOne({ role: RoleEnum.ADMIN });
			const adminWallet = await WalletModel.findOne({ userId: admin?._id, role: RoleEnum.ADMIN });
			if (!adminWallet) throw new Error("Admin wallet not found");
			return WalletEntity.fromDBDocument(adminWallet);
		} catch (error) {
			return handleExceptionError(error, "Error fetching platform wallet");
		}
	}

	async update(wallet: WalletEntity): Promise<WalletEntity> {
		try {
			const doc = await WalletModel.findByIdAndUpdate(wallet.id, wallet.toObject(), { new: true });
			return WalletEntity.fromDBDocument(doc);
		} catch (error) {
			return handleExceptionError(error, "Error updating wallet");
		}
	}

	async updateBalance(userId: string, amount: number, type: TransactionsTypeEnum = TransactionsTypeEnum.CREDIT, role: RoleEnum = RoleEnum.USER): Promise<WalletEntity | null> {
		try {
			let roleQuery: any = role === RoleEnum.ADMIN ? RoleEnum.ADMIN : { $in: [RoleEnum.USER, RoleEnum.MENTOR] };
			const updateAmount = type === TransactionsTypeEnum.CREDIT ? amount : -amount;

			const wallet = await WalletModel.findOneAndUpdate({ userId, role: roleQuery }, { $inc: { balance: updateAmount } }, { new: true });
			return wallet ? WalletEntity.fromDBDocument(wallet) : null;
		} catch (error) {
			return handleExceptionError(error, "Error updating wallet balance");
		}
	}

	async createTransaction(data: {
		fromUserId: string | null;
		toUserId: string;
		fromRole: RoleEnum;
		toRole: RoleEnum;
		amount: number;
		type: TransactionsTypeEnum;
		purpose: string;
		method: TransactionMethodEnum;
		description?: string;
		sessionId?: string | null;
	}): Promise<WalletTransactionEntity> {
		try {
			const transaction = await WalletTransactionModel.create({
				fromUserId: data.fromUserId,
				toUserId: data.toUserId,
				fromRole: data.fromRole,
				toRole: data.toRole,
				fromModel: data.fromRole === RoleEnum.ADMIN ? "admins" : "Users",
				toModel: data.toRole === RoleEnum.ADMIN ? "admins" : "Users",
				amount: data.amount,
				type: data.type,
				purpose: data.purpose,
				method: data.method,
				description: data.description,
				sessionId: data.sessionId || undefined,
			});

			return WalletTransactionEntity.fromDBDocument(transaction);
		} catch (error) {
			return handleExceptionError(error, "Error creating wallet transaction");
		}
	}

	async getTransactionsByUser(userId: string, page: number = 1, limit: number = 10, filter: Record<string, any> = {}): Promise<{ data: WalletTransactionEntity[]; total: number }> {
		try {
			const query: any = {
				$or: [
					{ fromUserId: userId, type: { $in: [TransactionsTypeEnum.DEBIT, TransactionsTypeEnum.WITHDRAWAL] } },
					{ toUserId: userId, type: TransactionsTypeEnum.CREDIT },
				],
			};

			if (filter.type && filter.type !== "all") {
				query.type = filter.type;
			}

			if (filter.createdAt) {
				query.createdAt = filter.createdAt;
			}

			const total = await WalletTransactionModel.countDocuments(query);

			const docs = await WalletTransactionModel.find(query)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.lean(); // Optional: better performance if you're not mutating the doc

			const data = docs.map((doc) => WalletTransactionEntity.fromDBDocument(doc));

			return { data, total };
		} catch (error) {
			return handleExceptionError(error, "Error fetching wallet transactions");
		}
	}

	async adminRevenue(adminId: string): Promise<number> {
		try {
			const result = await WalletTransactionModel.aggregate([
				{
					$match: {
						toUserId: new mongoose.Types.ObjectId(adminId),
						toRole: RoleEnum.ADMIN,
						purpose: { $in: [TransactionPurposeEnum.PLATFORM_FEE, TransactionPurposeEnum.PLATFORM_COMMISSION] },
						type: TransactionsTypeEnum.CREDIT,
					},
				},
				{
					$group: {
						_id: null,
						totalRevenue: { $sum: "$amount" },
					},
				},
			]);

			return result[0]?.totalRevenue || 0;
		} catch (error) {
			return handleExceptionError(error, "Error fetching admin revenue");
		}
	}

	async revenueChartData(
		adminId: string,
		months: number // 0 = all, 1 = last‑30‑days, 6 = 6 months, 12 = 1 year
	): Promise<{ name: string; total: number }[]> {
		try {
			/* ---------- 1. Match filter ------------------------------------ */
			const matchFilter: any = {
				toUserId: new mongoose.Types.ObjectId(adminId),
				toRole: "admin",
				type: "credit",
				purpose: { $in: [TransactionPurposeEnum.PLATFORM_FEE, TransactionPurposeEnum.PLATFORM_COMMISSION] },
			};

			// date‑range window (identical logic to userGrowthChartData)
			const today = new Date();
			if (months === 1) {
				matchFilter.createdAt = {
					$gte: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
				};
			} else if (months > 1) {
				matchFilter.createdAt = {
					$gte: new Date(today.getFullYear(), today.getMonth() - months, today.getDate()),
				};
			}
			// months === 0  →  no date filter  (all‑time)

			/* ---------- 2. Aggregation ------------------------------------- */
			const revenueData = await WalletTransactionModel.aggregate([
				{ $match: matchFilter },

				// a) group PER‑DAY  (year‑month‑day)
				{
					$group: {
						_id: {
							year: { $year: "$createdAt" },
							month: { $month: "$createdAt" },
							day: { $dayOfMonth: "$createdAt" },
						},
						total: { $sum: "$amount" },
					},
				},

				// b) build label & sortable date
				{
					$project: {
						name: {
							$concat: [{ $toString: "$_id.day" }, "-", { $toString: "$_id.month" }, "-", { $toString: "$_id.year" }],
						},
						total: 1,
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

				// c) chronological order
				{ $sort: { sortDate: 1 } },

				// d) final shape
				{ $project: { name: 1, total: 1 } },
			]);

			return revenueData;
		} catch (error) {
			return handleExceptionError(error, "Error fetching admin revenue chart data");
		}
	}
}

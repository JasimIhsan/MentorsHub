import { WalletModel } from "../models/wallet/wallet.model";
import { WalletTransactionModel } from "../models/wallet/wallet.transaction.model";
import { IWithdrawalRequestDocument, WithdrawalRequestModel } from "../models/wallet/wallet.withdrawel.request.model";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { WalletEntity } from "../../../domain/entities/wallet/wallet.entity";
import { WithdrawalRequestEntity } from "../../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { AdminModel } from "../models/admin/admin.model";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { WalletTransactionEntity } from "../../../domain/entities/wallet/wallet.transaction.entity";

export class WalletRepositoryImpl implements IWalletRepository {
	async findWalletByUserId(userId: string): Promise<WalletEntity | null> {
		try {
			const doc = await WalletModel.findOne({ userId });
			return doc ? WalletEntity.fromDBDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding wallet by userId");
		}
	}

	async createWallet(userId: string): Promise<WalletEntity> {
		try {
			const doc = await WalletModel.create({ userId, balance: 0 });
			return WalletEntity.fromDBDocument(doc);
		} catch (error) {
			return handleExceptionError(error, "Error creating wallet");
		}
	}

	async platformWallet(): Promise<WalletEntity> {
		try {
			const admin = await AdminModel.findOne({ role: "super-admin" });
			const adminWallet = await WalletModel.findOne({ userId: admin?._id, role: "admin" });
			if (!adminWallet) throw new Error("Admin wallet not found");
			return WalletEntity.fromDBDocument(adminWallet);
		} catch (error) {
			return handleExceptionError(error, "Error fetching platform wallet");
		}
	}

	async updateBalance(userId: string, amount: number, type: "credit" | "debit" = "credit", role: "user" | "mentor" | "admin" = "user"): Promise<WalletEntity | null> {
		try {
			let roleQuery: any = role === "admin" ? "admin" : { $in: ["user", "mentor"] };
			const updateAmount = type === "credit" ? amount : -amount;

			const wallet = await WalletModel.findOneAndUpdate({ userId, role: roleQuery }, { $inc: { balance: updateAmount } }, { new: true });
			return wallet ? WalletEntity.fromDBDocument(wallet) : null;
		} catch (error) {
			return handleExceptionError(error, "Error updating wallet balance");
		}
	}

	async createTransaction(data: {
		fromUserId: string | null;
		toUserId: string;
		fromRole: "user" | "mentor" | "admin";
		toRole: "user" | "mentor" | "admin";
		amount: number;
		type: "credit" | "debit" | "withdrawal";
		purpose: string;
		description?: string;
		sessionId?: string | null;
	}): Promise<WalletTransactionEntity> {
		try {
			const transaction = await WalletTransactionModel.create({
				fromUserId: data.fromUserId,
				toUserId: data.toUserId,
				fromRole: data.fromRole,
				toRole: data.toRole,
				fromModel: data.fromRole === "admin" ? "admins" : "Users",
				toModel: data.toRole === "admin" ? "admins" : "Users",
				amount: data.amount,
				type: data.type,
				purpose: data.purpose,
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
					{ fromUserId: userId, type: { $in: ["debit", "withdrawal"] } },
					{ toUserId: userId, type: "credit" },
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

	async createWithdrawalRequest(data: Partial<IWithdrawalRequestDocument>): Promise<WithdrawalRequestEntity> {
		try {
			const doc = await WithdrawalRequestModel.create(data);
			return WithdrawalRequestEntity.fromDBDocument(doc);
		} catch (error) {
			return handleExceptionError(error, "Error creating withdrawal request");
		}
	}

	async getWithdrawalRequests(mentorId: string, page: number = 1, limit: number = 10, filter: Record<string, any> = {}): Promise<{ data: WithdrawalRequestEntity[]; total: number }> {
		try {
			const query = { mentorId, ...filter };
			const total = await WithdrawalRequestModel.countDocuments(query);
			const docs = await WithdrawalRequestModel.find(query)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit);

			const data = docs.map((doc) => WithdrawalRequestEntity.fromDBDocument(doc));
			return { data, total };
		} catch (error) {
			return handleExceptionError(error, "Error fetching withdrawal requests");
		}
	}
}

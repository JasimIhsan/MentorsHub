import { WalletModel } from "../models/wallet/wallet.model";
import { WalletTransactionModel } from "../models/wallet/wallet.transaction.model";
import { IWithdrawalRequestDocument, WithdrawalRequestModel } from "../models/wallet/wallet.withdrawel.request.model";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletTransactionDTO } from "../../../application/dtos/wallet.transation.dto";
import { WalletEntity } from "../../../domain/entities/wallet.entity";
import { WithdrawalRequestEntity } from "../../../domain/entities/wallet.withdrawel.request.entity";
import { AdminModel } from "../models/admin/admin.model";

export class WalletRepositoryImpl implements IWalletRepository {
	async findWalletByUserId(userId: string): Promise<WalletEntity | null> {
		const doc = await WalletModel.findOne({ userId });
		return doc ? WalletEntity.fromDBDocument(doc) : null;
	}

	async createWallet(userId: string): Promise<WalletEntity> {
		const doc = await WalletModel.create({ userId, balance: 0 });
		return WalletEntity.fromDBDocument(doc);
	}

	async platformWallet(): Promise<WalletEntity> {
		const admin = await AdminModel.findOne({ role: "super-admin" });
		const adminWallet = await WalletModel.findOne({ userId: admin?._id, role: "admin" });
		if (!adminWallet) throw new Error("Admin wallet not found");
		return WalletEntity.fromDBDocument(adminWallet);
	}

	async updateBalance(userId: string, amount: number, type: "credit" | "debit" = "credit", role: "user" | "mentor" | "admin" = "user"): Promise<WalletEntity | null> {
		let roleQuery: any;
		if (role === "admin") {
			roleQuery = "admin";
		} else {
			roleQuery = { $in: ["user", "mentor"] }; // Matches either "user" or "mentor"
		}

		const updateAmount = type === "credit" ? amount : -amount;

		const wallet = await WalletModel.findOneAndUpdate({ userId, role: roleQuery }, { $inc: { balance: updateAmount } }, { new: true });

		return wallet ? WalletEntity.fromDBDocument(wallet) : null;
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
	}): Promise<IWalletTransactionDTO> {
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

		const doc = await WalletTransactionModel.findById(transaction._id).populate("fromUserId", "firstName lastName name avatar").populate("toUserId", "firstName lastName name avatar");

		return this.mapToWalletTransactionDTO(doc);
	}

	async getTransactionsByUser(userId: string, page: number = 1, limit: number = 10, filter: Record<string, any> = {}) {
		const query: any = {
			$or: [
				{ fromUserId: userId, type: { $in: ["debit", "withdrawal"] } },
				{ toUserId: userId, type: "credit" },
			],
		};

		if (filter.type) {
			query.type = filter.type === "all" ? { $in: ["credit", "debit", "withdrawal"] } : filter.type;
		}
		if (filter.createdAt) {
			query.createdAt = filter.createdAt;
		}

		const total = await WalletTransactionModel.countDocuments(query);

		let queryBuilder = WalletTransactionModel.find(query)
			.populate("fromUserId", "firstName lastName name avatar")
			.populate("toUserId", "firstName lastName name avatar")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		// Optional populate for sessionId
		queryBuilder = queryBuilder.populate({
			path: "sessionId",
			select: "topic",
			match: { sessionId: { $ne: null } },
		});

		const docs = await queryBuilder.exec();
		const data = docs.map((doc) => this.mapToWalletTransactionDTO(doc));

		return { data, total };
	}

	async createWithdrawalRequest(data: Partial<IWithdrawalRequestDocument>): Promise<WithdrawalRequestEntity> {
		const doc = await WithdrawalRequestModel.create(data);
		return WithdrawalRequestEntity.fromDBDocument(doc);
	}

	async getWithdrawalRequests(mentorId: string, page: number = 1, limit: number = 10, filter: Record<string, any> = {}): Promise<{ data: WithdrawalRequestEntity[]; total: number }> {
		const query = { mentorId, ...filter };

		const total = await WithdrawalRequestModel.countDocuments(query);
		const docs = await WithdrawalRequestModel.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		const data = docs.map((doc) => WithdrawalRequestEntity.fromDBDocument(doc));
		return { data, total };
	}

	mapToWalletTransactionDTO(doc: any): IWalletTransactionDTO {
		return {
			_id: doc._id.toString(),
			fromUserId: doc.fromUserId
				? {
						id: doc.fromUserId._id.toString(),
						name: doc.fromUserId.firstName && doc.fromUserId.lastName ? `${doc.fromUserId.firstName} ${doc.fromUserId.lastName}` : doc.fromUserId.name ?? "",
						avatar: doc.fromUserId.avatar,
				  }
				: null,
			toUserId: doc.toUserId
				? {
						id: doc.toUserId._id.toString(),
						name: doc.toUserId.firstName && doc.toUserId.lastName ? `${doc.toUserId.firstName} ${doc.toUserId.lastName}` : doc.toUserId.name ?? "",
						avatar: doc.toUserId.avatar,
				  }
				: null,
			fromRole: doc.fromRole,
			toRole: doc.toRole,
			amount: doc.amount,
			type: doc.type,
			purpose: doc.purpose,
			description: doc.description,
			sessionId:
				doc.sessionId && typeof doc.sessionId === "object"
					? {
							id: doc.sessionId._id.toString(),
							topic: doc.sessionId.topic,
					  }
					: null,
			createdAt: doc.createdAt,
		};
	}
}

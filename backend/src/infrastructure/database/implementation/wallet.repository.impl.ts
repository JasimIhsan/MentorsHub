import { WalletModel } from "../models/wallet/wallet.model";
import { WalletTransactionModel } from "../models/wallet/wallet.transaction.model";
import { IWithdrawalRequestDocument, WithdrawalRequestModel } from "../models/wallet/wallet.withdrawel.request.model";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletTransactionDTO } from "../../../application/dtos/wallet.transation.dto";
import { WalletEntity } from "../../../domain/entities/wallet.entity";
import { WithdrawalRequestEntity } from "../../../domain/entities/wallet.withdrawel.request.entity";

export class WalletRepositoryImpl implements IWalletRepository {
	async findWalletByUserId(userId: string): Promise<WalletEntity | null> {
		const doc = await WalletModel.findOne({ userId });
		return doc ? WalletEntity.fromDBDocument(doc) : null;
	}

	async createWallet(userId: string): Promise<WalletEntity> {
		const doc = await WalletModel.create({ userId, balance: 0 });
		return WalletEntity.fromDBDocument(doc);
	}

	async updateBalance(userId: string, amount: number): Promise<WalletEntity | null> {
		const doc = await WalletModel.findOneAndUpdate({ userId }, { $inc: { balance: amount } }, { new: true });
		return doc ? WalletEntity.fromDBDocument(doc) : null;
	}

	async createTransaction(data: {
		fromUserId: string | null;
		toUserId: string;
		fromRole: "user" | "mentor" | "admin";
		toRole: "user" | "mentor" | "admin";
		amount: number;
		type: "credit" | "debit";
		purpose: string;
		description?: string;
		sessionId?: string | null;
	}): Promise<IWalletTransactionDTO> {
		const transaction = await WalletTransactionModel.create(data);
		const doc = await WalletTransactionModel.findById(transaction._id).populate("fromUserId", "firstName lastName avatar").populate("toUserId", "firstName lastName avatar");
		return this.mapToWalletTransactionDTO(doc);
	}

	async getTransactionsByUser(userId: string, page: number = 1, limit: number = 10, filter: Record<string, any> = {}) {
		const query: any = {
			$or: [
				{ fromUserId: userId, type: "debit" },
				{ toUserId: userId, type: "credit" },
			],
		};

		if (filter.type) {
			query.type = filter.type === "all" ? { $in: ["credit", "debit"] } : filter.type;
		}
		if (filter.createdAt) {
			query.createdAt = filter.createdAt;
		}

		const total = await WalletTransactionModel.countDocuments(query);

		let queryBuilder = WalletTransactionModel.find(query)
			.populate("fromUserId", "firstName lastName avatar")
			.populate("toUserId", "firstName lastName avatar")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		// 👇 Conditionally populate sessionId only if it exists (not null or undefined)
		queryBuilder = queryBuilder.populate({
			path: "sessionId",
			select: "topic", // change fields as per your schema
			match: { sessionId: { $ne: null } }, // filters out null sessions, optional
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
						name: doc.fromUserId.firstName + " " + doc.fromUserId.lastName,
						avatar: doc.fromUserId.avatar,
				  }
				: null,
			toUserId: doc.toUserId
				? {
						id: doc.toUserId._id.toString(),
						name: doc.toUserId.firstName + " " + doc.toUserId.lastName,
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

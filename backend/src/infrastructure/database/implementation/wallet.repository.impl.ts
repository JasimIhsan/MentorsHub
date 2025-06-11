import mongoose, { ObjectId } from "mongoose";
import { WalletModel } from "../models/wallet/wallet.model";
import { IWalletTransactionDocument, WalletTransactionModel } from "../models/wallet/wallet.transaction.model";
import { IWithdrawalRequestDocument, WithdrawalRequestModel } from "../models/wallet/wallet.withdrawel.request.model";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletTransactionDTO } from "../../../application/dtos/wallet.transation.dto";
import { WalletEntity } from "../../../domain/entities/wallet.entity";
import { WalletTransactionEntity } from "../../../domain/entities/wallet.transaction.entity";
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
		const doc = await WalletTransactionModel.create(data);
		return this.mapToWalletTransactionDTO(doc);
	}

	async getTransactionsByUser(userId: string, page: number = 1, limit: number = 10, filter: Record<string, any> = {}) {
		const query: any = {
			$or: [{ fromUserId: userId }, { toUserId: userId }],
		};

		console.log(`filter : `, filter);

		// Merge filters into the query
		if (filter.type) filter.type === "all" ? (query.type = { $in: ["credit", "debit"] }) : (query.type = filter.type);
		if (filter.createdAt) query.createdAt = filter.createdAt;

		console.log(`query : `, query);

		const total = await WalletTransactionModel.countDocuments(query);

		const docs = await WalletTransactionModel.find(query)
			.populate("fromUserId", "firstName lastName avatar")
			.populate("toUserId", "firstName lastName avatar")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);
		console.log(`doc : `, docs);
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
			sessionId: doc.sessionId,
			createdAt: doc.createdAt,
		};
	}
}

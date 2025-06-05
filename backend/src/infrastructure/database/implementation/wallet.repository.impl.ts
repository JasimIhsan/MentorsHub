import mongoose, { ObjectId } from "mongoose";
import { WalletModel } from "../models/wallet/wallet.model";
import { IWalletTransactionDocument, WalletTransactionModel } from "../models/wallet/wallet.transaction.model";
import { IWithdrawalRequestDocument, WithdrawalRequestModel } from "../models/wallet/wallet.withdrawel.request.model";
import { WalletEntity } from "../../../domain/entities/wallet.entity";
import { WalletTransactionEntity } from "../../../domain/entities/wallet.transaction.entity";
import { WithdrawalRequestEntity } from "../../../domain/entities/wallet.withdrawel.request.entity";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";

export class WalletRepositoryImpl implements IWalletRepository {
	async findWalletByUserId(userId: string, role: string): Promise<WalletEntity | null> {
		const doc = await WalletModel.findOne({ userId, role });
		return doc ? WalletEntity.fromDBDocument(doc) : null;
	}

	async createWallet(userId: string, role: string): Promise<WalletEntity> {
		const doc = await WalletModel.create({ userId, role, balance: 0 });
		return WalletEntity.fromDBDocument(doc);
	}

	async updateBalance(userId: string, role: string, amount: number): Promise<WalletEntity | null> {
		const doc = await WalletModel.findOneAndUpdate({ userId, role }, { $inc: { balance: amount } }, { new: true });
		return doc ? WalletEntity.fromDBDocument(doc) : null;
	}

	async createTransaction(data: Partial<IWalletTransactionDocument>): Promise<WalletTransactionEntity> {
		const doc = await WalletTransactionModel.create(data);
		return WalletTransactionEntity.fromDBDocument(doc);
	}

	async getTransactionsByUser(userId: string, role: string, page: number = 1, limit: number = 10, filter: Record<string, any> = {}): Promise<{ data: WalletTransactionEntity[]; total: number }> {
		const query = {
			$or: [
				{ fromUserId: userId, fromRole: role },
				{ toUserId: userId, toRole: role },
			],
			...filter,
		};

		const total = await WalletTransactionModel.countDocuments(query);
		const docs = await WalletTransactionModel.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		const data = docs.map((doc) => WalletTransactionEntity.fromDBDocument(doc));
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
}

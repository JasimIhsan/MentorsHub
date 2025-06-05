// domain/interfaces/wallet.repo.interface.ts

import { ObjectId } from "mongoose";
import { WalletEntity } from "../entities/wallet.entity";
import { WalletTransactionEntity } from "../entities/wallet.transaction.entity";
import { WithdrawalRequestEntity } from "../entities/wallet.withdrawel.request.entity";

export interface IWalletRepository {
	findWalletByUserId(userId: ObjectId, role: string): Promise<WalletEntity | null>;
	createWallet(userId: ObjectId, role: string): Promise<WalletEntity>;
	updateBalance(userId: ObjectId, role: string, amount: number): Promise<WalletEntity | null>;
	createTransaction(data: Partial<WalletTransactionEntity>): Promise<WalletTransactionEntity>;
	getTransactionsByUser(userId: ObjectId, role: string, page?: number, limit?: number, filter?: Record<string, any>): Promise<{ data: WalletTransactionEntity[]; total: number }>;
	createWithdrawalRequest(data: Partial<WithdrawalRequestEntity>): Promise<WithdrawalRequestEntity>;
	getWithdrawalRequests(mentorId: ObjectId, page?: number, limit?: number, filter?: Record<string, any>): Promise<{ data: WithdrawalRequestEntity[]; total: number }>;
}

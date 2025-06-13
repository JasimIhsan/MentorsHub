import { IWalletTransactionDTO } from "../../application/dtos/wallet.transation.dto";
import { WalletEntity } from "../entities/wallet.entity";
import { WalletTransactionEntity } from "../entities/wallet.transaction.entity";
import { WithdrawalRequestEntity } from "../entities/wallet.withdrawel.request.entity";

export interface IWalletRepository {
	findWalletByUserId(userId: string): Promise<WalletEntity | null>;
	createWallet(userId: string): Promise<WalletEntity>;
	platformWallet(): Promise<WalletEntity>;
	updateBalance(userId: string, amount: number, type?: "credit" | "debit", role?: "user" | "mentor" | "admin"): Promise<WalletEntity | null>;
	createTransaction(data: {
		fromUserId: string | null;
		toUserId: string;
		fromRole: "user" | "mentor" | "admin";
		toRole: "user" | "mentor" | "admin";
		amount: number;
		type: "credit" | "debit";
		purpose: string;
		description?: string;
		sessionId?: string | null;
	}): Promise<IWalletTransactionDTO>;
	getTransactionsByUser(userId: string, page?: number, limit?: number, filter?: Record<string, any>): Promise<{ data: IWalletTransactionDTO[]; total: number }>;
	createWithdrawalRequest(data: Partial<WithdrawalRequestEntity>): Promise<WithdrawalRequestEntity>;
	getWithdrawalRequests(mentorId: string, page?: number, limit?: number, filter?: Record<string, any>): Promise<{ data: WithdrawalRequestEntity[]; total: number }>;
}

import { WalletEntity } from "../entities/wallet/wallet.entity";
import { WalletTransactionEntity } from "../entities/wallet/wallet.transaction.entity";
import { WithdrawalRequestEntity } from "../entities/wallet/wallet.withdrawel.request.entity";

export interface IWalletRepository {
	findWalletByUserId(userId: string): Promise<WalletEntity | null>;
	createWallet(userId: string): Promise<WalletEntity>;
	platformWallet(): Promise<WalletEntity>;
	updateBalance(userId: string, amount: number, type?: "credit" | "debit", role?: RoleEnum): Promise<WalletEntity | null>;
	createTransaction(data: {
		fromUserId: string | null;
		toUserId: string;
		fromRole: RoleEnum;
		toRole: RoleEnum;
		amount: number;
		type: "credit" | "debit" | "withdrawal";
		purpose: string;
		description?: string;
		sessionId?: string | null;
	}): Promise<WalletTransactionEntity>;
	getTransactionsByUser(userId: string, page?: number, limit?: number, filter?: Record<string, any>): Promise<{ data: WalletTransactionEntity[]; total: number }>;
	createWithdrawalRequest(data: Partial<WithdrawalRequestEntity>): Promise<WithdrawalRequestEntity>;
	getWithdrawalRequests(mentorId: string, page?: number, limit?: number, filter?: Record<string, any>): Promise<{ data: WithdrawalRequestEntity[]; total: number }>;
}

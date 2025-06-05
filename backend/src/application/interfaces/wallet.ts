import { WalletEntity } from "../../domain/entities/wallet.entity";
import { WalletTransactionEntity } from "../../domain/entities/wallet.transaction.entity";
import { WithdrawalRequestEntity } from "../../domain/entities/wallet.withdrawel.request.entity";

export interface ICreateWalletUsecase {
	execute(userId: string, role: string): Promise<WalletEntity>;
}

export interface ICreateTransactionUsecase {
	execute(data: Partial<WalletTransactionEntity>): Promise<WalletTransactionEntity>;
}

export interface ICreateWithdrawalRequestUsecase {
	execute(data: Partial<WithdrawalRequestEntity>): Promise<WithdrawalRequestEntity>;
}

export interface IGetTransactionsUsecase {
	execute(userId: string, role: string, page: number, limit: number, filter: Record<string, any>): Promise<{ data: WalletTransactionEntity[]; total: number }>;
}

export interface IGetWithdrawalRequestsUsecase {
	execute(mentorId: string, page: number, limit: number, filter: Record<string, any>): Promise<{ data: WithdrawalRequestEntity[]; total: number }>;
}

export interface IUpdateWalletBalanceUsecase {
	execute(userId: string, role: string, amount: number): Promise<WalletEntity | null>
}
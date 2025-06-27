import { WalletEntity } from "../../domain/entities/wallet/wallet.entity";
import { WithdrawalRequestEntity } from "../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { IWalletTransactionDTO } from "../dtos/wallet.transation.dto";
import { RoleEnum } from "./role";

export interface ICreateWalletUsecase {
	execute(userId: string, role: string): Promise<WalletEntity>;
}

export interface ICreateTransactionUsecase {
	execute(data: {
		fromUserId: string | null;
		toUserId: string;
		fromRole: "user" | "mentor" | "admin";
		toRole: "user" | "mentor" | "admin";
		amount: number;
		type: "credit" | "debit" | "withdrawal";
		purpose: string;
		description?: string;
		sessionId?: string | null;
	}): Promise<IWalletTransactionDTO>;
}

export interface ICreateWithdrawalRequestUsecase {
	execute(data: Partial<WithdrawalRequestEntity>): Promise<WithdrawalRequestEntity>;
}

export interface IGetTransactionsUsecase {
	execute(userId: string, role: string, page: number, limit: number, filter: Record<string, any>): Promise<{ data: IWalletTransactionDTO[]; total: number }>;
}

export interface IGetWithdrawalRequestsUsecase {
	execute(mentorId: string, page: number, limit: number, filter: Record<string, any>): Promise<{ data: WithdrawalRequestEntity[]; total: number }>;
}

export interface IUpdateWalletBalanceUsecase {
	execute(userId: string, amount: number, type: string): Promise<WalletEntity | null>;
}

export interface IWalletTopUpUsecase {
	execute(data: { userId: string; amount: number; purpose?: string; description?: string }): Promise<{ wallet: WalletEntity; transaction: IWalletTransactionDTO }>;
}

export interface IGetWalletUsecase {
	execute(userId: string): Promise<WalletEntity | null>;
}

export interface IWithdrawWalletUsecase {
	execute(userId: string, amount: number): Promise<{ wallet: WalletEntity; transaction: IWalletTransactionDTO }> 
}
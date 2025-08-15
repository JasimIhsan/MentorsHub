import { WithdrawalRequestEntity } from "../../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { IWalletDTO } from "../../dtos/wallet.dtos";
import { IWalletTransactionDTO } from "../../dtos/wallet.transation.dto";
import { RoleEnum } from "../enums/role.enum";
import { TransactionsTypeEnum } from "../enums/transaction.type.enum";

export interface ICreateWalletUsecase {
	execute(userId: string, role: string): Promise<IWalletDTO>;
}

export interface ICreateTransactionUsecase {
	execute(data: {
		fromUserId: string | null;
		toUserId: string;
		fromRole: RoleEnum;
		toRole: RoleEnum;
		amount: number;
		type: TransactionsTypeEnum;
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
	execute(userId: string, amount: number, type: string): Promise<IWalletDTO | null>;
}

export interface IWalletTopUpUsecase {
	execute(data: { userId: string; amount: number; purpose?: string; description?: string }): Promise<{ wallet: IWalletDTO; transaction: IWalletTransactionDTO }>;
}

export interface IGetWalletUsecase {
	execute(userId: string): Promise<IWalletDTO | null>;
}

export interface IWithdrawWalletUsecase {
	execute(userId: string, amount: number): Promise<{ wallet: IWalletDTO; transaction: IWalletTransactionDTO }> 
}
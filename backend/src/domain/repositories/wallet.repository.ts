import { RoleEnum } from "../../application/interfaces/enums/role.enum";
import { TransactionsTypeEnum } from "../../application/interfaces/enums/transaction.type.enum";
import { WalletEntity } from "../entities/wallet/wallet.entity";
import { WalletTransactionEntity } from "../entities/wallet/wallet.transaction.entity";
import { WithdrawalRequestEntity } from "../entities/wallet/wallet.withdrawel.request.entity";

export interface IWalletRepository {
	findWalletByUserId(userId: string): Promise<WalletEntity | null>;
	createWallet(userId: string, role: RoleEnum): Promise<WalletEntity>;
	platformWallet(): Promise<WalletEntity>;
	updateBalance(userId: string, amount: number, type?: TransactionsTypeEnum, role?: RoleEnum): Promise<WalletEntity | null>;
	createTransaction(data: {
		fromUserId: string | null;
		toUserId: string;
		fromRole: RoleEnum;
		toRole: RoleEnum;
		amount: number;
		type: TransactionsTypeEnum;
		purpose: string;
		description?: string;
		sessionId?: string | null;
	}): Promise<WalletTransactionEntity>;
	getTransactionsByUser(userId: string, page?: number, limit?: number, filter?: Record<string, any>): Promise<{ data: WalletTransactionEntity[]; total: number }>;
	adminRevenue(adminId: string): Promise<number>;
	revenueChartData(adminId: string, months: number): Promise<{ name: string; total: number }[]>;
}

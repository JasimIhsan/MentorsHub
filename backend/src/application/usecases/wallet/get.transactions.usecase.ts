import { WalletTransactionEntity } from "../../../domain/entities/wallet.transaction.entity";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletTransactionDTO } from "../../dtos/wallet.transation.dto";
import { IGetTransactionsUsecase } from "../../interfaces/wallet";

export class GetTransactionsUseCase implements IGetTransactionsUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(userId: string, role: string, page: number, limit: number, filter: Record<string, any> = {}): Promise<{ data: IWalletTransactionDTO[]; total: number }> {
		return this.walletRepo.getTransactionsByUser(userId, page, limit, filter);
	}
}

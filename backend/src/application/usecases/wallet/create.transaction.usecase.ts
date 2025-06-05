import { WalletTransactionEntity } from "../../../domain/entities/wallet.transaction.entity";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { ICreateTransactionUsecase } from "../../interfaces/wallet";

export class CreateTransactionUseCase implements ICreateTransactionUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(data: Partial<WalletTransactionEntity>): Promise<WalletTransactionEntity> {
		return this.walletRepo.createTransaction(data);
	}
}

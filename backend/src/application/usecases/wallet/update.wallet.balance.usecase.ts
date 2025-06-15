import { WalletEntity } from "../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IUpdateWalletBalanceUsecase } from "../../interfaces/wallet";

export class UpdateWalletBalanceUseCase implements IUpdateWalletBalanceUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(userId: string, amount: number): Promise<WalletEntity | null> {
		return this.walletRepo.updateBalance(userId, amount);
	}
}

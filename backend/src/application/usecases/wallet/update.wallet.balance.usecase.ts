import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletDTO, mapToWalletDTO } from "../../dtos/wallet.dtos";
import { IUpdateWalletBalanceUsecase } from "../../interfaces/usecases/wallet";

export class UpdateWalletBalanceUseCase implements IUpdateWalletBalanceUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(userId: string, amount: number): Promise<IWalletDTO | null> {
		const wallet = await this.walletRepo.updateBalance(userId, amount);
		if(!wallet) throw new Error("Failed to update wallet balance");
		return mapToWalletDTO(wallet);
	}
}

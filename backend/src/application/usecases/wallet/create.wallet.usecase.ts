import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletDTO, mapToWalletDTO } from "../../dtos/wallet.dtos";
import { ICreateWalletUsecase } from "../../interfaces/wallet";

export class CreateWalletUseCase implements ICreateWalletUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(userId: string): Promise<IWalletDTO> {
		const existing = await this.walletRepo.findWalletByUserId(userId);
		if (existing) return mapToWalletDTO(existing);
		const wallet = await this.walletRepo.createWallet(userId);
		return mapToWalletDTO(wallet);
	}
}

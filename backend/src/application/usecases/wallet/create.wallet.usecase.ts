import { ObjectId } from "mongoose";
import { WalletEntity } from "../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { ICreateWalletUsecase } from "../../interfaces/wallet";

export class CreateWalletUseCase implements ICreateWalletUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(userId: string): Promise<WalletEntity> {
		const existing = await this.walletRepo.findWalletByUserId(userId);
		if (existing) return existing;
		return this.walletRepo.createWallet(userId);
	}
}

import { WalletEntity } from "../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IGetWalletUsecase } from "../../interfaces/wallet";

export class GetWalletUsecase implements IGetWalletUsecase {
	constructor(private walletRepository: IWalletRepository) {}

	async execute(userId: string): Promise<WalletEntity | null> {
		return await this.walletRepository.findWalletByUserId(userId);
	}
}

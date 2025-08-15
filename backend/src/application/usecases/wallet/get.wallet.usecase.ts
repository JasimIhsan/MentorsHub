import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletDTO, mapToWalletDTO } from "../../dtos/wallet.dtos";
import { IGetWalletUsecase } from "../../interfaces/usecases/wallet";

export class GetWalletUsecase implements IGetWalletUsecase {
	constructor(private walletRepository: IWalletRepository) {}

	async execute(userId: string): Promise<IWalletDTO | null> {
		const wallet = await this.walletRepository.findWalletByUserId(userId);
		if(!wallet) throw new Error("Wallet not found for user");
		return mapToWalletDTO(wallet);
	}
}

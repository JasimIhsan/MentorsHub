import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletDTO, mapToWalletDTO } from "../../dtos/wallet.dtos";
import { RoleEnum } from "../../interfaces/enums/role.enum";
import { ICreateWalletUsecase } from "../../interfaces/usecases/wallet";

export class CreateWalletUseCase implements ICreateWalletUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(userId: string, role: string): Promise<IWalletDTO> {
		const existing = await this.walletRepo.findWalletByUserId(userId);
		if (existing) return mapToWalletDTO(existing);
		const wallet = await this.walletRepo.createWallet(userId, role as RoleEnum);
		return mapToWalletDTO(wallet);
	}
}

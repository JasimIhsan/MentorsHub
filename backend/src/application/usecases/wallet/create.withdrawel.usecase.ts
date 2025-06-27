import { WithdrawalRequestEntity } from "../../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { ICreateWithdrawalRequestUsecase } from "../../interfaces/wallet";

export class CreateWithdrawalRequestUseCase implements ICreateWithdrawalRequestUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(data: Partial<WithdrawalRequestEntity>): Promise<WithdrawalRequestEntity> {
		return this.walletRepo.createWithdrawalRequest(data);
	}
}

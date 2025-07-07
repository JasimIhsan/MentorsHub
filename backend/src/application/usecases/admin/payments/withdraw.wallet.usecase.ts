import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { IWalletDTO, mapToWalletDTO } from "../../../dtos/wallet.dtos";
import { IWalletTransactionDTO } from "../../../dtos/wallet.transation.dto";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { IWithdrawWalletUsecase, ICreateTransactionUsecase } from "../../../interfaces/wallet";

export class WithdrawWalletUseCase implements IWithdrawWalletUsecase {
	constructor(private walletRepo: IWalletRepository, private createTransactionUseCase: ICreateTransactionUsecase) {}

	async execute(userId: string, amount: number): Promise<{ wallet: IWalletDTO; transaction: IWalletTransactionDTO }> {
		if (amount <= 0) throw new Error("Amount must be greater than zero");

		const wallet = await this.walletRepo.findWalletByUserId(userId);
		if (!wallet) throw new Error("Wallet not found for user");

		if (wallet.balance < amount) throw new Error("Insufficient balance");

		const transaction = await this.createTransactionUseCase.execute({
			fromUserId: userId,
			toUserId: userId,
			fromRole: RoleEnum.ADMIN,
			toRole: RoleEnum.USER,
			amount,
			type: "withdrawal",
			purpose: "withdrawal",
			description: "Wallet withdrawal",
			sessionId: null,
		});

		const updatedWallet = await this.walletRepo.updateBalance(userId, amount, "debit");
		if (!updatedWallet) throw new Error("Failed to update wallet balance");

		return { wallet: mapToWalletDTO(updatedWallet), transaction };
	}
}

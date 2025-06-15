import { WalletEntity } from "../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletTransactionDTO } from "../../dtos/wallet.transation.dto";
import { RoleEnum } from "../../interfaces/role";
import { ICreateTransactionUsecase, IWithdrawWalletUsecase } from "../../interfaces/wallet";

export class WithdrawWalletUseCase implements IWithdrawWalletUsecase {
	constructor(private walletRepo: IWalletRepository, private createTransactionUseCase: ICreateTransactionUsecase) {}

	async execute(userId: string, amount: number): Promise<{ wallet: WalletEntity; transaction: IWalletTransactionDTO }> {
		if (amount <= 0) throw new Error("Amount must be greater than zero");

		const wallet = await this.walletRepo.findWalletByUserId(userId);
		if (!wallet) throw new Error("Wallet not found for user");

		if (wallet.getBalance() < amount) throw new Error("Insufficient balance");

		const role = wallet.getRole() as RoleEnum;
		let transaction = null;
		if (role === RoleEnum.MENTOR || role === RoleEnum.USER) {
			transaction = await this.createTransactionUseCase.execute({
				fromUserId: userId,
				toUserId: userId,
				fromRole: "admin",
				toRole: "user",
				amount,
				type: "withdrawal",
				purpose: "withdrawal",
				description: "Wallet withdrawal",
				sessionId: null,
			});
		} else {
			const adminId = wallet.getUserId();
			transaction = await this.createTransactionUseCase.execute({
				fromUserId: adminId,
				toUserId: adminId,
				fromRole: "admin",
				toRole: "admin",
				amount,
				type: "withdrawal",
				purpose: "withdrawal",
				description: "Admin withdrew platform profit",
				sessionId: null,
			});
		}

		const updatedWallet = await this.walletRepo.updateBalance(userId, amount, "debit", role);
		if (!updatedWallet) throw new Error("Failed to update wallet balance");

		return { wallet: updatedWallet, transaction };
	}
}

import { ICreateTransactionUsecase, IWalletTopUpUsecase } from "../../interfaces/wallet";
import { WalletTransactionEntity } from "../../../domain/entities/wallet.transaction.entity";
import { WalletEntity } from "../../../domain/entities/wallet.entity";
import { IWalletTransactionDTO } from "../../dtos/wallet.transation.dto";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";

interface TopUpWalletInput {
	userId: string;
	amount: number;
	purpose?: string;
	description?: string;
}

export class WalletTopUpUseCase implements IWalletTopUpUsecase {
	constructor(private walletRepo: IWalletRepository, private createTransactionUseCase: ICreateTransactionUsecase) {}

	async execute(data: TopUpWalletInput): Promise<{ wallet: WalletEntity; transaction: IWalletTransactionDTO }> {
		const { userId, amount, purpose, description } = data;

		if (amount <= 0) {
			throw new Error("Amount must be greater than zero.");
		}

		let wallet = await this.walletRepo.findWalletByUserId(userId);

		if (!wallet) {
			wallet = await this.walletRepo.createWallet(userId);
		}

		const updatedWallet = await this.walletRepo.updateBalance(userId, amount);
		if (!updatedWallet) {
			throw new Error("Failed to update wallet balance.");
		}

		const transaction = await this.createTransactionUseCase.execute({
			fromUserId: null,
			toUserId: userId,
			fromRole: "admin",
			toRole: "user",
			amount,
			type: "credit",
			purpose: purpose ?? "wallet_topup",
			description: description ?? "Wallet top-up",
			sessionId: null,
		});

		return {
			wallet: updatedWallet,
			transaction,
		};
	}
}

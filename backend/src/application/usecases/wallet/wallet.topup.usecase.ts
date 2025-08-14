import { ICreateTransactionUsecase, IWalletTopUpUsecase } from "../../interfaces/usecases/wallet";
import { IWalletTransactionDTO } from "../../dtos/wallet.transation.dto";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletDTO, mapToWalletDTO } from "../../dtos/wallet.dtos";
import { RoleEnum } from "../../interfaces/enums/role.enum";
import { TransactionsTypeEnum } from "../../interfaces/enums/transaction.type.enum";
import { TransactionPurposeEnum } from "../../interfaces/enums/transaction.purpose.enum";
import { INotifyUserUseCase } from "../../interfaces/usecases/notification/notification.usecase";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";

interface TopUpWalletInput {
	userId: string;
	amount: number;
	purpose?: string;
	description?: string;
}

export class WalletTopUpUseCase implements IWalletTopUpUsecase {
	constructor(private walletRepo: IWalletRepository, private createTransactionUseCase: ICreateTransactionUsecase, private notifyUserUseCase: INotifyUserUseCase) {}

	async execute(data: TopUpWalletInput): Promise<{ wallet: IWalletDTO; transaction: IWalletTransactionDTO }> {
		const { userId, amount, purpose, description } = data;

		if (amount <= 0) {
			throw new Error("Amount must be greater than zero.");
		}

		let wallet = await this.walletRepo.findWalletByUserId(userId);

		if (!wallet) {
			wallet = await this.walletRepo.createWallet(userId, RoleEnum.USER);
		}

		const updatedWallet = await this.walletRepo.updateBalance(userId, amount);
		if (!updatedWallet) {
			throw new Error("Failed to update wallet balance.");
		}

		const transaction = await this.createTransactionUseCase.execute({
			fromUserId: null,
			toUserId: userId,
			fromRole: RoleEnum.ADMIN,
			toRole: RoleEnum.USER,
			amount,
			type: TransactionsTypeEnum.CREDIT,
			purpose: purpose ?? TransactionPurposeEnum.WALLET_TOPUP,
			description: description ?? "Wallet top-up",
			sessionId: null,
		});

		await this.notifyUserUseCase.execute({
			title: "💰 Wallet Top-up Successful",
			message: `Your wallet has been topped up with ₹${amount.toFixed(2)}.`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.SUCCESS,
			link: "/wallet",
		});

		return {
			wallet: mapToWalletDTO(updatedWallet),
			transaction,
		};
	}
}

import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletDTO, mapToWalletDTO } from "../../dtos/wallet.dtos";
import { IWalletTransactionDTO } from "../../dtos/wallet.transation.dto";
import { RoleEnum } from "../../interfaces/enums/role.enum";
import { TransactionPurposeEnum } from "../../interfaces/enums/transaction.purpose.enum";
import { TransactionsTypeEnum } from "../../interfaces/enums/transaction.type.enum";
import { ICreateTransactionUsecase, IWithdrawWalletUsecase } from "../../interfaces/usecases/wallet";
import { INotifyUserUseCase } from "../../interfaces/usecases/notification/notification.usecase";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";

export class WithdrawWalletUseCase implements IWithdrawWalletUsecase {
	constructor(private walletRepo: IWalletRepository, private createTransactionUseCase: ICreateTransactionUsecase, private notifyUserUseCase: INotifyUserUseCase) {}

	async execute(userId: string, amount: number): Promise<{ wallet: IWalletDTO; transaction: IWalletTransactionDTO }> {
		if (amount <= 0) throw new Error("Amount must be greater than zero");

		const wallet = await this.walletRepo.findWalletByUserId(userId);
		if (!wallet) throw new Error("Wallet not found for user");

		if (wallet.balance < amount) throw new Error("Insufficient balance");

		const role = wallet.role as RoleEnum;
		let transaction = null;

		if (role === RoleEnum.MENTOR || role === RoleEnum.USER) {
			transaction = await this.createTransactionUseCase.execute({
				fromUserId: userId,
				toUserId: userId,
				fromRole: RoleEnum.ADMIN,
				toRole: RoleEnum.USER,
				amount,
				type: TransactionsTypeEnum.WITHDRAWAL,
				purpose: TransactionPurposeEnum.WITHDRAWAL,
				description: "Wallet withdrawal",
				sessionId: null,
			});

			await this.notifyUserUseCase.execute({
				title: "💸 Withdrawal Successful",
				message: `Your withdrawal of ₹${amount.toFixed(2)} has been processed successfully.`,
				isRead: false,
				recipientId: userId,
				type: NotificationTypeEnum.SUCCESS,
				link: "/wallet",
			});
		} else {
			const adminId = wallet.userId;
			transaction = await this.createTransactionUseCase.execute({
				fromUserId: adminId,
				toUserId: adminId,
				fromRole: RoleEnum.ADMIN,
				toRole: RoleEnum.ADMIN,
				amount,
				type: TransactionsTypeEnum.WITHDRAWAL,
				purpose: TransactionPurposeEnum.WITHDRAWAL,
				description: "Admin withdrew platform profit",
				sessionId: null,
			});
		}

		const updatedWallet = await this.walletRepo.updateBalance(userId, amount, TransactionsTypeEnum.DEBIT, role);
		if (!updatedWallet) throw new Error("Failed to update wallet balance");

		return { wallet: mapToWalletDTO(updatedWallet), transaction };
	}
}

import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { IWithdrawalRequestRepository } from "../../../../domain/repositories/withdrawal.request.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IWithdrawalRequestDTO, mapToWithdrawalRequestDTO } from "../../../dtos/withdrawal.request.dto";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { TransactionPurposeEnum } from "../../../interfaces/enums/transaction.purpose.enum";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";
import { WithdrawalRequestStatusEnum } from "../../../interfaces/enums/withdrawel.request.status.enum";
import { INotifyUserUseCase } from "../../../interfaces/usecases/notification/notification.usecase";
import { IApproveWithdrawalRequestUseCase } from "../../../interfaces/usecases/withdrawal.request";

export class ApproveWithdrawalRequestUseCase implements IApproveWithdrawalRequestUseCase {
	constructor(
		private readonly _withdrawalRequestRepo: IWithdrawalRequestRepository, //
		private readonly _walletRepo: IWalletRepository,
		private readonly _notifyUserUsecase: INotifyUserUseCase,
		private readonly _userRepo: IUserRepository,
	) {}

	async execute(requestId: string, paymentId: string): Promise<IWithdrawalRequestDTO> {
		const request = await this._withdrawalRequestRepo.findById(requestId);
		if (!request) throw new Error("Withdrawal request not found.");
		if (request.status === WithdrawalRequestStatusEnum.COMPLETED) throw new Error("Withdrawal request already completed.");
		if (request.status === WithdrawalRequestStatusEnum.REJECTED) throw new Error("Withdrawal request already rejected.");

		const wallet = await this._walletRepo.findWalletByUserId(request.userId);
		if (!wallet) throw new Error("Wallet not found for user.");

		const platformWallet = await this._walletRepo.platformWallet();

		await this._walletRepo.updateBalance(request.userId, request.amount, TransactionsTypeEnum.DEBIT);
		await this._walletRepo.updateBalance(platformWallet.userId, request.amount, TransactionsTypeEnum.DEBIT, RoleEnum.ADMIN);

		const transaction = await this._walletRepo.createTransaction({
			fromUserId: platformWallet.userId,
			fromRole: RoleEnum.ADMIN,
			toUserId: request.userId,
			toRole: RoleEnum.USER,
			amount: request.amount,
			type: TransactionsTypeEnum.WITHDRAWAL,
			purpose: TransactionPurposeEnum.WITHDRAWAL,
			description: "Wallet withdrawal",
		});

		request.complete(transaction.id!);
		await this._withdrawalRequestRepo.update(request);

		wallet.withdrawalCompleted();
		await this._walletRepo.update(wallet);

		await this._notifyUserUsecase.execute({
			recipientId: request.userId,
			title: "💸 Withdrawal Successful",
			message: `Your withdrawal request of ₹${request.amount.toFixed(2)} has been processed successfully.`,
			isRead: false,
			type: NotificationTypeEnum.SUCCESS,
		});

		const user = await this._userRepo.findUserById(request.userId);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		return mapToWithdrawalRequestDTO(request, user);
	}
}

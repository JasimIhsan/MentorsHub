import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { IWithdrawalRequestRepository } from "../../../../domain/repositories/withdrawal.request.repository";
import { IWithdrawalRequestDTO, mapToWithdrawalRequestDTO } from "../../../dtos/withdrawal.request.dto";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { INotifyUserUseCase } from "../../../interfaces/usecases/notification/notification.usecase";
import { IRejectWithdrawalRequestUseCase } from "../../../interfaces/usecases/withdrawal.request";

export class RejectWithdrawalRequestUseCase implements IRejectWithdrawalRequestUseCase {
	constructor(private readonly _withdrawalRequestRepo: IWithdrawalRequestRepository, private readonly _walletRepo: IWalletRepository, private readonly _notifyUserUsecase: INotifyUserUseCase, private readonly _userRepo: IUserRepository) {}

	async execute(requestId: string): Promise<IWithdrawalRequestDTO> {
		const withdrawalRequest = await this._withdrawalRequestRepo.findById(requestId);
		if (!withdrawalRequest) {
			throw new Error("Withdrawal request not found");
		}
		withdrawalRequest.reject();

		const wallet = await this._walletRepo.findWalletByUserId(withdrawalRequest.userId);
		if (!wallet) {
			throw new Error("Wallet not found for user.");
		}

		wallet.withdrawalRequestRejected();
		await this._walletRepo.update(wallet);
		await this._withdrawalRequestRepo.update(withdrawalRequest);

		await this._notifyUserUsecase.execute({
			title: "💸 Withdrawal Rejected",
			message: "Your withdrawal request has been rejected by the admin.",
			recipientId: withdrawalRequest.userId,
			isRead: false,
			type: NotificationTypeEnum.ERROR,
		});

		const user = await this._userRepo.findUserById(withdrawalRequest.userId);
		return user ? mapToWithdrawalRequestDTO(withdrawalRequest, user) : mapToWithdrawalRequestDTO(withdrawalRequest);
	}
}

import { WithdrawalRequestEntity } from "../../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWithdrawalRequestRepository } from "../../../domain/repositories/withdrawal.request.repository";
import { IWithdrawalRequestDTO, mapToWithdrawalRequestDTO } from "../../dtos/withdrawal.request.dto";
import { WithdrawalRequestStatusEnum } from "../../interfaces/enums/withdrawel.request.status.enum";
import { IRequestWithdrawalUseCase } from "../../interfaces/usecases/withdrawal.request";

export class RequestWithdrawalUseCase implements IRequestWithdrawalUseCase {
	constructor(
		private readonly _withdrawalRequestRepo: IWithdrawalRequestRepository, //
		private readonly _walletRepo: IWalletRepository,
		private readonly _userRepo: IUserRepository,
	) {}

	async execute(userId: string, amount: number): Promise<IWithdrawalRequestDTO> {
		const existigRequest = await this._withdrawalRequestRepo.findPendingByUserId(userId);

		if (existigRequest) throw new Error("User already has a pending withdrawal request.");

		const wallet = await this._walletRepo.findWalletByUserId(userId);
		if (!wallet) throw new Error("Wallet not found for user.");
		if (wallet.isRequestedWithdrawal) throw new Error("User already has a pending withdrawal request.");
		if (wallet.balance < 0) throw new Error("Withdrawal not allowed. Your wallet is in debt to the platform.");
		if (wallet.balance < amount) throw new Error("Insufficient balance.");

		const request = new WithdrawalRequestEntity({
			userId,
			amount,
			status: WithdrawalRequestStatusEnum.PENDING,
		});

		const savedRequest = await this._withdrawalRequestRepo.create(request);

		if (savedRequest) {
			wallet.withdrawalRequested();
			await this._walletRepo.update(wallet);
		}

		const user = await this._userRepo.findUserById(userId);
		return mapToWithdrawalRequestDTO(savedRequest, user ?? undefined);
	}
}

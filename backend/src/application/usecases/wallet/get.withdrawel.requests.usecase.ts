import { WithdrawalRequestEntity } from "../../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IGetWithdrawalRequestsUsecase } from "../../interfaces/wallet";

export class GetWithdrawalRequestsUseCase implements IGetWithdrawalRequestsUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(mentorId: string, page: number, limit: number, filter: Record<string, any> = {}): Promise<{ data: WithdrawalRequestEntity[]; total: number }> {
		return this.walletRepo.getWithdrawalRequests(mentorId, page, limit, filter);
	}
}

import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { IWithdrawalRequestRepository } from "../../../../domain/repositories/withdrawal.request.repository";
import { WithdrawalRequestStatusEnum } from "../../../interfaces/enums/withdrawel.request.status.enum";
import { IPaymentGateway } from "../../../interfaces/services/payment.service";
import { IWithdrawPaymentCreateOrderUseCase } from "../../../interfaces/usecases/withdrawal.request";
import { v4 as uuidv4 } from "uuid";

export class WithdrawPaymentCreateOrderUseCase implements IWithdrawPaymentCreateOrderUseCase {
	constructor(private readonly paymentGateway: IPaymentGateway, private readonly _withdrawalRequestRepo: IWithdrawalRequestRepository) {}

	async execute(requestId: string): Promise<string> {
		const request = await this._withdrawalRequestRepo.findById(requestId);
		if (!request) throw new Error("Withdrawal request not found.");
		if (request.status === WithdrawalRequestStatusEnum.COMPLETED) throw new Error("Withdrawal request already completed.");
		if (request.status === WithdrawalRequestStatusEnum.REJECTED) throw new Error("Withdrawal request already rejected.");

		const amount = request.amount * 100;
		const receipt = `withdraw_${uuidv4().slice(0, 8)}`;
		const notes = { requestId, userId: request.userId };

		const order = await this.paymentGateway.createOrder(amount, receipt, notes);
		return order;
	}
}

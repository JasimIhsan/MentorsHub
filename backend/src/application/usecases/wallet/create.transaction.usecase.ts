import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletTransactionDTO } from "../../dtos/wallet.transation.dto";
import { ICreateTransactionUsecase } from "../../interfaces/wallet";

export class CreateTransactionUseCase implements ICreateTransactionUsecase {
	constructor(private walletRepo: IWalletRepository) {}

	async execute(data: {
		fromUserId: string | null;
		toUserId: string;
		fromRole: "user" | "mentor" | "admin";
		toRole: "user" | "mentor" | "admin";
		amount: number;
		type: "credit" | "debit" | "withdrawal";
		purpose: string;
		description?: string;
		sessionId?: string | null;
	}): Promise<IWalletTransactionDTO> {
		return await this.walletRepo.createTransaction(data);
	}
}

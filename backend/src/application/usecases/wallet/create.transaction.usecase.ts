import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletTransactionDTO, mapToTransactionDTO } from "../../dtos/wallet.transation.dto";
import { ICreateTransactionUsecase } from "../../interfaces/wallet";

export class CreateTransactionUseCase implements ICreateTransactionUsecase {
	constructor(private walletRepo: IWalletRepository, private userRepo: IUserRepository, private sessionRepo: ISessionRepository) {}

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
		console.log("data : ", data);
		const transaction = await this.walletRepo.createTransaction(data);
		console.log("transaction: ", transaction);

		const [fromUser, toUser, session] = await Promise.all([transaction.fromUserId ? this.userRepo.findUserById(transaction.fromUserId) : null, this.userRepo.findUserById(transaction.toUserId), transaction.sessionId ? this.sessionRepo.getSessionById(transaction.sessionId) : null]);

		const dto = mapToTransactionDTO(transaction, fromUser, toUser, session);
		console.log("dto: ", dto);
		return dto;
	}
}

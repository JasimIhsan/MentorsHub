import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { INotifyUserUseCase } from "../../../interfaces/notification/notification.usecase";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";
import { TransactionPurposeEnum } from "../../../interfaces/enums/transaction.purpose.enum";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { IReleaseSessionFundsUseCase } from "../../../interfaces/session";

export class ReleaseSessionFundsUseCase implements IReleaseSessionFundsUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(sessionId: string): Promise<void> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error("Session not found");

		if (session.status !== SessionStatusEnum.COMPLETED) {
			throw new Error("Funds can only be released after session completion.");
		}

		const mentorId = session.mentor.id;
		const totalAmount = session.totalAmount;

		//  Fee calculation
		const platformFixedFee = 40;
		const platformCommission = session.totalAmount * 0.15; // 15% commission
		const platformTotalFee = platformFixedFee + platformCommission;
		const mentorEarnings = Math.max(totalAmount - platformTotalFee, 0);

		//  Wallet updates
		await this.walletRepo.updateBalance(mentorId, mentorEarnings, TransactionsTypeEnum.CREDIT, RoleEnum.MENTOR);

		const platformWallet = await this.walletRepo.platformWallet();

		// Transaction record - platform debit
		await this.walletRepo.createTransaction({
			fromUserId: platformWallet.userId,
			toUserId: mentorId,
			fromRole: RoleEnum.ADMIN,
			toRole: RoleEnum.MENTOR,
			amount: mentorEarnings,
			type: TransactionsTypeEnum.DEBIT, // money going out of platform wallet
			purpose: TransactionPurposeEnum.SESSION_FEE,
			description: `Funds debited from platform wallet for completed session "${session.topic}"`,
			sessionId,
		});

		// Transaction record - mentor credit
		await this.walletRepo.createTransaction({
			fromUserId: platformWallet.userId,
			toUserId: mentorId,
			fromRole: RoleEnum.ADMIN,
			toRole: RoleEnum.MENTOR,
			amount: mentorEarnings,
			type: TransactionsTypeEnum.CREDIT, // money credited to mentor
			purpose: TransactionPurposeEnum.SESSION_FEE,
			description: `Funds credited to your wallet for completed session "${session.topic}"`,
			sessionId,
		});

		//  Notify mentor
		await this.notifyUserUseCase.execute({
			title: "💰 Funds Released",
			message: `₹${mentorEarnings.toFixed(2)} has been credited to your wallet for session "${session.topic}". You can request a withdrawal anytime.`,
			isRead: false,
			recipientId: mentorId,
			type: NotificationTypeEnum.PAYMENT,
		});
	}
}

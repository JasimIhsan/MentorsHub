import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IPaySessionWithWalletUseCase } from "../../../interfaces/usecases/session";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";
import { TransactionPurposeEnum } from "../../../interfaces/enums/transaction.purpose.enum";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { INotifyUserUseCase } from "../../../interfaces/usecases/notification/notification.usecase";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { v4 as uuid } from "uuid";

export class PaySessionWithWalletUseCase implements IPaySessionWithWalletUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(sessionId: string, userId: string, paymentStatus: SessionPaymentStatusEnum, status: SessionStatusEnum): Promise<void> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// Check session time
		const [hours, minutes] = session.startTime.split(":").map(Number);
		const sessionDateTime = new Date(session.date);
		sessionDateTime.setHours(hours, minutes, 0, 0);
		if (sessionDateTime.getTime() < Date.now()) {
			throw new Error("Session is already expired. You cannot make payment.");
		}

		// Validate participant
		const participant = session.findParticipant(userId);
		if (!participant) throw new Error("Unauthorized: User is not a participant in this session");
		if (participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) {
			throw new Error("Session already paid");
		}

		// Payment amount
		const totalPaid = session.totalAmount;

		// Wallet check
		const userWallet = await this.walletRepo.findWalletByUserId(userId);
		if (!userWallet || userWallet.balance < totalPaid) {
			throw new Error("Insufficient wallet balance");
		}

		// Move funds into platform wallet (HOLD)
		const platformWallet = await this.walletRepo.platformWallet();
		await this.walletRepo.updateBalance(userId, totalPaid, TransactionsTypeEnum.DEBIT);
		await this.walletRepo.updateBalance(platformWallet.userId, totalPaid, TransactionsTypeEnum.CREDIT, RoleEnum.ADMIN);

		// Record HOLD transaction
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: totalPaid,
			type: TransactionsTypeEnum.CREDIT,
			purpose: TransactionPurposeEnum.SESSION_FEE,
			description: `Funds held for session "${session.topic}"`,
			sessionId,
		});

		// Record DEBIT transaction
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: totalPaid,
			type: TransactionsTypeEnum.DEBIT,
			purpose: TransactionPurposeEnum.SESSION_FEE,
			description: `Debited from your wallet for session "${session.topic}"`,
			sessionId,
		});

		// Mark payment complete
		const paymentId = `wal-${uuid().slice(0, 8)}`;
		await this.sessionRepo.markPayment(sessionId, userId, paymentStatus, paymentId, status);

		// Notify user
		await this.notifyUserUseCase.execute({
			title: "💰 Payment Successful",
			message: `Your wallet payment of ₹${totalPaid.toFixed(2)} for the session "${session.topic}" was successful and is being held until the session completes.`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.PAYMENT,
		});

		// Notify mentor (payment held)
		await this.notifyUserUseCase.execute({
			title: "📅 New Booking Paid",
			message: `A new session "${session.topic}" has been booked and paid. The payment is securely held by the platform and will be released to you once the session is completed.`,
			isRead: false,
			recipientId: session.mentor.id,
			type: NotificationTypeEnum.PAYMENT,
		});
	}
}

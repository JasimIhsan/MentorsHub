import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { TransactionPurposeEnum } from "../../../interfaces/enums/transaction.purpose.enum";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";
import { INotifyUserUseCase } from "../../../interfaces/notification/notification.usecase";
import { IPaySessionWithGatewayUseCase } from "../../../interfaces/session";

export class PaySessionWithGatewayUseCase implements IPaySessionWithGatewayUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: SessionPaymentStatusEnum, status: SessionStatusEnum): Promise<void> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// Validate session time
		const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
		sessionDateTime.setMinutes(sessionDateTime.getMinutes() + 10);

		if (sessionDateTime.getTime() < Date.now()) {
			throw new Error("Payment time expired. The session has already started or ended.");
		}

		// Validate participant
		const participant = session.findParticipant(userId);
		if (!participant) throw new Error("Unauthorized access to session");
		if (participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) {
			throw new Error("Payment already completed for this session.");
		}

		const totalAmount = session.totalAmount;
		const mentorId = session.mentor.id;

		// Platform wallet (holding account)
		const platformWallet = await this.walletRepo.platformWallet();

		// CREDIT full amount to platform wallet (hold funds)
		await this.walletRepo.updateBalance(platformWallet.userId, totalAmount, TransactionsTypeEnum.CREDIT, RoleEnum.ADMIN);

		// Transaction record - held funds
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: totalAmount,
			type: TransactionsTypeEnum.CREDIT,
			purpose: TransactionPurposeEnum.SESSION_FEE,
			description: `Full payment for session "${session.topic}" held in platform wallet until completion.`,
			sessionId,
		});

		// DEBIT proof for user wallet (only a ledger entry, no balance update)
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: totalAmount,
			type: TransactionsTypeEnum.DEBIT,
			purpose: TransactionPurposeEnum.SESSION_FEE,
			description: `Payment for session "${session.topic}" via Razorpay.`,
			sessionId,
		});

		// Update session payment status
		await this.sessionRepo.markPayment(sessionId, userId, paymentStatus, paymentId, status);

		// Notify user (payer)
		await this.notifyUserUseCase.execute({
			title: "💰 Payment Successful",
			message: `Your payment of ₹${totalAmount.toFixed(2)} for the session "${session.topic}" was successful and is being held until the session completes.`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.PAYMENT,
		});

		// Notify mentor (payment held)
		await this.notifyUserUseCase.execute({
			title: "📅 New Booking Paid",
			message: `A new session "${session.topic}" has been booked and paid. The payment is securely held by the platform and will be released to you once the session is completed.`,
			isRead: false,
			recipientId: mentorId,
			type: NotificationTypeEnum.PAYMENT,
		});
	}
}

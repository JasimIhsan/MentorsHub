import { RefundEntity } from "../../../domain/entities/refund.entity";
import { IRefundRepository } from "../../../domain/repositories/refund.repository";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";
import { RefundInitiatorEnum, RefundStatusEnum } from "../../interfaces/enums/refund.enums";
import { RoleEnum } from "../../interfaces/enums/role.enum";
import { SessionPaymentStatusEnum } from "../../interfaces/enums/session.payment.status.enum";
import { SessionStatusEnum } from "../../interfaces/enums/session.status.enums";
import { TransactionPurposeEnum } from "../../interfaces/enums/transaction.purpose.enum";
import { TransactionsTypeEnum } from "../../interfaces/enums/transaction.type.enum";
import { INotifyUserUseCase } from "../../interfaces/usecases/notification/notification.usecase";
import { ICancelSessionRefundUseCase } from "../../interfaces/usecases/refund";

const PLATFORM_FIXED_FEE = 40;
const PLATFORM_COMMISSION_PERCENTAGE = 0.15;

export class UserCancelSessionRefundUseCase implements ICancelSessionRefundUseCase {
	constructor(private readonly sessionRepository: ISessionRepository, private readonly walletRepo: IWalletRepository, private readonly notifyUserUseCase: INotifyUserUseCase, private readonly refundRepo: IRefundRepository) {}

	async execute(sessionId: string, userId: string): Promise<void> {
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) throw new Error("Session not found");
		if (session.pricing === "free") return;

		const participant = session.findParticipant(userId);
		if (!participant) throw new Error("You are not a participant in this session");

		if (![SessionStatusEnum.UPCOMING, SessionStatusEnum.APPROVED].includes(session.status)) {
			throw new Error("Only upcoming or approved sessions can be refunded");
		}

		if (participant.paymentStatus !== SessionPaymentStatusEnum.COMPLETED) {
			throw new Error("Payment not completed, cannot refund");
		}

		// --- Fee calculations ---
		const sessionAmount = session.totalAmount;
		const userRefund = sessionAmount - PLATFORM_FIXED_FEE; // refund everything except fixed fee

		// --- Platform wallet holds all funds
		const platformWallet = await this.walletRepo.platformWallet();

		// Refund from platform wallet
		await this.walletRepo.updateBalance(platformWallet.userId, userRefund, TransactionsTypeEnum.DEBIT, RoleEnum.ADMIN);
		await this.walletRepo.updateBalance(userId, userRefund, TransactionsTypeEnum.CREDIT, RoleEnum.USER);

		// --- Record DEBIT transaction for platform ---
		await this.walletRepo.createTransaction({
			fromUserId: platformWallet.userId,
			toUserId: userId,
			fromRole: RoleEnum.ADMIN,
			toRole: RoleEnum.USER,
			amount: userRefund,
			type: TransactionsTypeEnum.DEBIT, // Money going out of platform
			purpose: TransactionPurposeEnum.REFUND,
			description: `Refund debited from platform wallet for canceled session "${session.topic}" by user`,
			sessionId,
		});

		// --- Record CREDIT transaction for user ---
		await this.walletRepo.createTransaction({
			fromUserId: platformWallet.userId,
			toUserId: userId,
			fromRole: RoleEnum.ADMIN,
			toRole: RoleEnum.USER,
			amount: userRefund,
			type: TransactionsTypeEnum.CREDIT, // Money credited to user
			purpose: TransactionPurposeEnum.REFUND,
			description: `Refund credited to your wallet for canceled session "${session.topic}" (platform fee ₹${PLATFORM_FIXED_FEE} retained)`,
			sessionId,
		});

		// --- Save refund record ---
		const refundEntity = new RefundEntity({
			sessionId: session.id,
			paymentId: participant.paymentId || "",
			userId,
			initiatedBy: RefundInitiatorEnum.SYSTEM,
			reason: "User canceled paid session before 24 hours",
			originalAmount: sessionAmount,
			refundAmount: userRefund,
			platformFeeRefunded: false,
			status: RefundStatusEnum.PROCESSED,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await this.refundRepo.create(refundEntity);

		// --- Update session status ---
		await this.sessionRepository.updateStatus(sessionId, SessionStatusEnum.CANCELED);

		// --- Notify user ---
		await this.notifyUserUseCase.execute({
			title: "💰 Refund Processed",
			message: `Your refund of ₹${userRefund} for the session "${session.topic}" has been processed.`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.PAYMENT,
		});

		// --- Notify mentor (earnings cancelled, but no negative balance) ---
		await this.notifyUserUseCase.execute({
			title: "⚠️ Earnings Cancelled",
			message: `Earnings for the session "${session.topic}" have been cancelled due to a user cancellation before start time.`,
			isRead: false,
			recipientId: session.mentor.id,
			type: NotificationTypeEnum.ERROR,
		});
	}
}

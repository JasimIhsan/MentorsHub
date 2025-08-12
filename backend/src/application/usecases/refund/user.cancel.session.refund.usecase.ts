import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { RefundEntity } from "../../../domain/entities/refund.entity";
import { RefundInitiatorEnum, RefundStatusEnum } from "../../interfaces/enums/refund.enums";
import { SessionStatusEnum } from "../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../interfaces/enums/session.payment.status.enum";
import { TransactionsTypeEnum } from "../../interfaces/enums/transaction.type.enum";
import { TransactionPurposeEnum } from "../../interfaces/enums/transaction.purpose.enum";
import { RoleEnum } from "../../interfaces/enums/role.enum";
import { INotifyUserUseCase } from "../../interfaces/notification/notification.usecase";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";
import { IRefundRepository } from "../../../domain/repositories/refund.repository";
import { IUserCancelSessionRefundUseCase } from "../../interfaces/refund";

const PLATFORM_FIXED_FEE = 40;
const PLATFORM_COMMISSION_PERCENTAGE = 0.15;

export class UserCancelSessionRefundUseCase implements IUserCancelSessionRefundUseCase {
	constructor(
		private readonly sessionRepository: ISessionRepository, //
		private readonly walletRepo: IWalletRepository,
		private readonly notifyUserUseCase: INotifyUserUseCase,
		private readonly refundRepo: IRefundRepository
	) {}

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
		const platformCommission = (sessionAmount - PLATFORM_FIXED_FEE) * PLATFORM_COMMISSION_PERCENTAGE;
		const totalPlatformAmount = PLATFORM_FIXED_FEE + platformCommission;
		const mentorEarning = sessionAmount - totalPlatformAmount;
		const userRefund = sessionAmount - PLATFORM_FIXED_FEE;

		const mentorId = session.mentor.id;
		const platformWallet = await this.walletRepo.platformWallet();

		// --- Debit mentor earnings (allow negative balance)
		await this.walletRepo.updateBalance(mentorId, mentorEarning, TransactionsTypeEnum.DEBIT, RoleEnum.MENTOR);

		// --- Refund to user
		await this.walletRepo.updateBalance(userId, userRefund, TransactionsTypeEnum.CREDIT);

		// --- Debit platform commission
		await this.walletRepo.updateBalance(platformWallet.userId, platformCommission, TransactionsTypeEnum.DEBIT, RoleEnum.ADMIN);

		// --- Record transactions ---

		// Mentor earning debt
		await this.walletRepo.createTransaction({
			fromUserId: mentorId,
			toUserId: userId,
			fromRole: RoleEnum.MENTOR,
			toRole: RoleEnum.USER,
			amount: mentorEarning,
			type: TransactionsTypeEnum.DEBIT,
			purpose: TransactionPurposeEnum.REFUND,
			description: `Refund for canceled session "${session.topic}"`,
			sessionId,
		});

		// Platform commission debt
		await this.walletRepo.createTransaction({
			fromUserId: platformWallet.userId,
			toUserId: userId,
			fromRole: RoleEnum.ADMIN,
			toRole: RoleEnum.USER,
			amount: platformCommission,
			type: TransactionsTypeEnum.DEBIT,
			purpose: TransactionPurposeEnum.REFUND,
			description: `Refund for canceled session "${session.topic}"`,
			sessionId,
		});

		// User refund
		await this.walletRepo.createTransaction({
			fromUserId: platformWallet.userId,
			toUserId: userId,
			fromRole: RoleEnum.ADMIN,
			toRole: RoleEnum.USER,
			amount: userRefund,
			type: TransactionsTypeEnum.CREDIT,
			purpose: TransactionPurposeEnum.REFUND,
			description: `Refund for canceled session "${session.topic}"`,
			sessionId,
		});

		// --- Save refund record ---
		const refundEntity = new RefundEntity({
			sessionId: session.id,
			paymentId: participant.paymentId || "",
			userId,
			initiatedBy: RefundInitiatorEnum.SYSTEM,
			reason: "User canceled paid session before start time",
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

		// --- Notify mentor about negative balance if applicable ---
		const mentorWallet = await this.walletRepo.findWalletByUserId(mentorId);
		if (mentorWallet && mentorWallet.balance < 0) {
			await this.notifyUserUseCase.execute({
				title: "⚠️ Balance Negative",
				message: `Your balance is now ₹${mentorWallet.balance}. Future earnings will be used to clear this balance due to a refund for "${session.topic}".`,
				isRead: false,
				recipientId: mentorId,
				type: NotificationTypeEnum.ERROR,
			});
		} else {
			await this.notifyUserUseCase.execute({
				title: "⚠️ Earnings Reversed",
				message: `Earnings for the session "${session.topic}" have been reversed due to a cancellation.`,
				isRead: false,
				recipientId: mentorId,
				type: NotificationTypeEnum.ERROR,
			});
		}
	}
}

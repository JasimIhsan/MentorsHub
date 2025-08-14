import { RefundEntity } from "../../../domain/entities/refund.entity";
import { IRefundRepository } from "../../../domain/repositories/refund.repository";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";
import { RefundInitiatorEnum, RefundStatusEnum } from "../../interfaces/enums/refund.enums";
import { RoleEnum } from "../../interfaces/enums/role.enum";
import { SessionStatusEnum } from "../../interfaces/enums/session.status.enums";
import { TransactionPurposeEnum } from "../../interfaces/enums/transaction.purpose.enum";
import { TransactionsTypeEnum } from "../../interfaces/enums/transaction.type.enum";
import { INotifyUserUseCase } from "../../interfaces/usecases/notification/notification.usecase";
import { ICancelSessionRefundUseCase } from "../../interfaces/usecases/refund";

export class MentorCancelSessionRefundUseCase implements ICancelSessionRefundUseCase {
	constructor(private readonly sessionRepository: ISessionRepository, private readonly walletRepo: IWalletRepository, private readonly notifyUserUseCase: INotifyUserUseCase, private readonly refundRepo: IRefundRepository) {}

	async execute(sessionId: string, userId: string): Promise<void> {
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) throw new Error("Session not found");
		if (session.pricing === "free") return;

		// Get platform wallet
		const platformWallet = await this.walletRepo.platformWallet();

		// --- Full refund (mentor at fault) ---
		const sessionAmount = session.totalAmount;
		const userRefund = sessionAmount; // includes ₹40 fixed fee

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
			type: TransactionsTypeEnum.DEBIT, // Platform losing money
			purpose: TransactionPurposeEnum.REFUND,
			description: `Refund debited from platform wallet for canceled session "${session.topic}"`,
			sessionId,
		});

		// --- Record CREDIT transaction for user ---
		await this.walletRepo.createTransaction({
			fromUserId: platformWallet.userId,
			toUserId: userId,
			fromRole: RoleEnum.ADMIN,
			toRole: RoleEnum.USER,
			amount: userRefund,
			type: TransactionsTypeEnum.CREDIT, // User gaining money
			purpose: TransactionPurposeEnum.REFUND,
			description: `Full refund credited to your wallet for canceled session "${session.topic}"`,
			sessionId,
		});

		const participant = session.paidParticipants.find((p) => p.user.id === userId);

		// --- Save refund record ---
		const refundEntity = new RefundEntity({
			sessionId: session.id,
			paymentId: participant?.paymentId || "",
			userId,
			initiatedBy: RefundInitiatorEnum.SYSTEM,
			reason: "Mentor canceled session before 24 hours",
			originalAmount: sessionAmount,
			refundAmount: userRefund,
			platformFeeRefunded: true,
			status: RefundStatusEnum.PROCESSED,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await this.refundRepo.create(refundEntity);

		// --- Update session status ---
		await this.sessionRepository.updateStatus(sessionId, SessionStatusEnum.CANCELED);

		// --- Notify user ---
		await this.notifyUserUseCase.execute({
			title: "💰 Full Refund Processed",
			message: `Your full refund of ₹${userRefund} for the session "${session.topic}" has been processed because the mentor canceled.`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.PAYMENT,
		});

		// --- Notify mentor ---
		await this.notifyUserUseCase.execute({
			title: "⚠️ Session Canceled",
			message: `You canceled the session "${session.topic}". The user has been fully refunded, including the platform fee.`,
			isRead: false,
			recipientId: session.mentor.id,
			type: NotificationTypeEnum.ERROR,
		});
	}
}

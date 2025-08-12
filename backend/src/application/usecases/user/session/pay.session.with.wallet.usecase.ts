import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IPaySessionWithWalletUseCase } from "../../../interfaces/session";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";
import { TransactionPurposeEnum } from "../../../interfaces/enums/transaction.purpose.enum";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { INotifyUserUseCase } from "../../../interfaces/notification/notification.usecase";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { v4 as uuid } from "uuid";

// Constants
const PLATFORM_FIXED_FEE = 40;
const PLATFORM_COMMISSION_PERCENTAGE = 0.15;

// Utility
function getSessionDateTime(date: Date, time: string): Date {
	const [hours, minutes] = time.split(":").map(Number);
	const sessionDate = new Date(date);
	sessionDate.setHours(hours, minutes, 0, 0);
	return sessionDate;
}

export class PaySessionWithWalletUseCase implements IPaySessionWithWalletUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(sessionId: string, userId: string, paymentStatus: SessionPaymentStatusEnum, status: SessionStatusEnum): Promise<void> {
		// Get session
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// Check session expiry
		const sessionDateTime = getSessionDateTime(session.date, session.startTime);
		if (sessionDateTime.getTime() < Date.now()) {
			throw new Error("Session is already expired. You cannot make payment.");
		}

		// Validate participant
		const participant = session.findParticipant(userId);
		if (!participant) throw new Error("Unauthorized: User is not a participant in this session");
		if (participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) {
			throw new Error("Session already paid");
		}

		// Calculate Fees
		const totalPaid = session.totalAmount;
		const platformCommission = session.fee * PLATFORM_COMMISSION_PERCENTAGE;
		const totalPlatformFee = PLATFORM_FIXED_FEE + platformCommission;
		const mentorEarning = Math.max(totalPaid - totalPlatformFee, 0);

		// Wallet check
		const userWallet = await this.walletRepo.findWalletByUserId(userId);
		if (!userWallet || userWallet.balance < totalPaid) {
			throw new Error("Insufficient wallet balance");
		}

		// Wallet Transfers
		const mentorId = session.mentor.id;
		const platformWallet = await this.walletRepo.platformWallet();

		await this.walletRepo.updateBalance(userId, totalPaid, TransactionsTypeEnum.DEBIT);
		if (mentorEarning > 0) {
			await this.walletRepo.updateBalance(mentorId, mentorEarning, TransactionsTypeEnum.CREDIT);
		}
		await this.walletRepo.updateBalance(platformWallet.userId, totalPlatformFee, TransactionsTypeEnum.CREDIT, RoleEnum.ADMIN);

		// Record Transactions
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: mentorId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.MENTOR,
			amount: totalPaid,
			type: TransactionsTypeEnum.DEBIT,
			purpose: TransactionPurposeEnum.SESSION_FEE,
			description: `Wallet payment for session "${session.topic}"`,
			sessionId,
		});

		if (mentorEarning > 0) {
			await this.walletRepo.createTransaction({
				fromUserId: userId,
				toUserId: mentorId,
				fromRole: RoleEnum.USER,
				toRole: RoleEnum.MENTOR,
				amount: mentorEarning,
				type: TransactionsTypeEnum.CREDIT,
				purpose: TransactionPurposeEnum.SESSION_FEE,
				description: `Mentor earning for session "${session.topic}"`,
				sessionId,
			});
		}

		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: PLATFORM_FIXED_FEE,
			type: TransactionsTypeEnum.CREDIT,
			purpose: TransactionPurposeEnum.PLATFORM_FEE,
			description: `Fixed platform fee for session "${session.topic}"`,
			sessionId,
		});

		if (platformCommission > 0) {
			await this.walletRepo.createTransaction({
				fromUserId: userId,
				toUserId: platformWallet.userId,
				fromRole: RoleEnum.USER,
				toRole: RoleEnum.ADMIN,
				amount: platformCommission,
				type: TransactionsTypeEnum.CREDIT,
				purpose: TransactionPurposeEnum.PLATFORM_COMMISSION,
				description: `15% platform commission for session "${session.topic}"`,
				sessionId,
			});
		}

		// Mark payment complete
		const paymentId = `wal-${uuid()}`;
		console.log('paymentId in wallet usecase: ', paymentId);
		await this.sessionRepo.markPayment(sessionId, userId, paymentStatus, paymentId, status);

		// Notify both mentor & user
		await this.notifyUserUseCase.execute({
			title: "💰 Payment Successful",
			message: `Your wallet payment of ₹${totalPaid.toFixed(2)} for the session "${session.topic}" was successful.`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.PAYMENT,
		});

		if (mentorEarning > 0) {
			await this.notifyUserUseCase.execute({
				title: "💰 Session Payout Received",
				message: `You've received ₹${mentorEarning.toFixed(2)} for the session "${session.topic}".`,
				isRead: false,
				recipientId: mentorId,
				type: NotificationTypeEnum.PAYMENT,
			});
		}
	}
}

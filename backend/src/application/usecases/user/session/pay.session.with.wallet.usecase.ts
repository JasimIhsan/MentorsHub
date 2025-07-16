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

export class PaySessionWithWalletUseCase implements IPaySessionWithWalletUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: SessionPaymentStatusEnum, status: SessionStatusEnum): Promise<void> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		const sessionDate = new Date(session.date);
		const [hour, minute] = session.time.split(":").map(Number);
		sessionDate.setHours(hour);
		sessionDate.setMinutes(minute);
		if (sessionDate.getTime() < Date.now()) {
			throw new Error("Session is already expired. You cannot make payment.");
		}

		const participant = session.participants.find((p) => p.user.id === userId);
		if (!participant) throw new Error("Unauthorized: User is not a participant in this session");
		if (participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) {
			throw new Error("Session already booked");
		}

		const totalPaid = session.totalAmount;
		const platformFixedFee = 40;
		const platformCommission = session.fee * 0.15;
		const totalPlatformFee = platformFixedFee + platformCommission;
		const mentorEarning = Math.max(totalPaid - totalPlatformFee, 0);

		const userWallet = await this.walletRepo.findWalletByUserId(userId);
		if (!userWallet || userWallet.balance < totalPaid) {
			throw new Error("Insufficient wallet balance");
		}

		await this.walletRepo.updateBalance(userId, totalPaid, TransactionsTypeEnum.DEBIT);

		const mentorId = session.mentor.id;
		if (mentorEarning > 0) {
			await this.walletRepo.updateBalance(mentorId, mentorEarning, TransactionsTypeEnum.CREDIT);
		}

		const platformWallet = await this.walletRepo.platformWallet();
		await this.walletRepo.updateBalance(platformWallet.userId, totalPlatformFee, TransactionsTypeEnum.CREDIT, RoleEnum.ADMIN);

		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: mentorId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.MENTOR,
			amount: totalPaid,
			type: TransactionsTypeEnum.DEBIT,
			purpose: TransactionPurposeEnum.SESSION_FEE,
			description: `Wallet payment for session ${session.topic}`,
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
				description: `Mentor earning for session ${session.topic}`,
				sessionId,
			});

			await this.notifyUserUseCase.execute({
				title: "💰 Session Payout Received",
				message: `You've received ₹${mentorEarning.toFixed(2)} for the session "${session.topic}".`,
				isRead: false,
				recipientId: mentorId,
				type: NotificationTypeEnum.PAYMENT,
			});
		}

		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: platformFixedFee,
			type: TransactionsTypeEnum.CREDIT,
			purpose: TransactionPurposeEnum.PLATFORM_FEE,
			description: `Fixed platform fee for session ${session.topic}`,
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
				description: `15% commission for session ${session.topic}`,
				sessionId,
			});
		}

		await this.sessionRepo.markPayment(sessionId, userId, paymentStatus, paymentId, status);

		await this.notifyUserUseCase.execute({
			title: "💰 Payment Successful",
			message: `Your wallet payment of ₹${totalPaid.toFixed(2)} for the session "${session.topic}" was successful.`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.PAYMENT,
		});
	}
}

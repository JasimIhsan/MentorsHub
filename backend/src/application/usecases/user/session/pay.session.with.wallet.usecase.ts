// application/use‑cases/session/pay‑session‑with‑wallet.usecase.ts
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IPaySessionWithWalletUseCase } from "../../../interfaces/session";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";
import { TransactionPurposeEnum } from "../../../interfaces/enums/transaction.purpose.enum";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";

export class PaySessionWithWalletUseCase implements IPaySessionWithWalletUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: SessionPaymentStatusEnum, status: SessionStatusEnum): Promise<void> {
		/* 1. Fetch and validate session */
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		const sessionDate = new Date(session.date);
		const [hour, minute] = session.time.split(":").map(Number);
		sessionDate.setHours(hour);
		sessionDate.setMinutes(minute);
		if (sessionDate.getTime() < Date.now()) {
			throw new Error("Session is already expired. You cannot make payment.");
		}

		/* 2. Validate participant */
		const participant = session.participants.find((p) => p.user.id === userId);
		if (!participant) throw new Error("Unauthorized: User is not a participant in this session");
		if (participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) {
			throw new Error("Session already booked");
		}

		/* 3. Fee breakdown */
		const totalPaid = session.totalAmount; // ₹ paid by user
		const platformFixedFee = 40;
		const platformCommission = session.fee * 0.15;
		const totalPlatformFee = platformFixedFee + platformCommission;
		const mentorEarning = Math.max(totalPaid - totalPlatformFee, 0);

		/* 4. Check user wallet balance */
		const userWallet = await this.walletRepo.findWalletByUserId(userId);
		if (!userWallet || userWallet.balance < totalPaid) {
			throw new Error("Insufficient wallet balance");
		}

		/* 5. Debit user wallet once */
		await this.walletRepo.updateBalance(userId, totalPaid, TransactionsTypeEnum.DEBIT);

		/* 6. Credit mentor (if any) */
		const mentorId = session.mentor.id;
		if (mentorEarning > 0) {
			await this.walletRepo.updateBalance(mentorId, mentorEarning, TransactionsTypeEnum.CREDIT);
		}

		/* 7. Credit platform wallet (fixed + commission) */
		const platformWallet = await this.walletRepo.platformWallet();
		await this.walletRepo.updateBalance(platformWallet.userId, totalPlatformFee, TransactionsTypeEnum.CREDIT, RoleEnum.ADMIN);

		/* 8. Transaction records */

		// a)  User → (split) : overall debit
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

		// b)  User → Mentor credit (if > 0)
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
		}

		// c)  User → Platform fixed ₹40
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

		// d)  User → Platform 15 % commission
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

		/* 9. Mark payment in session */
		await this.sessionRepo.markPayment(sessionId, userId, paymentStatus, paymentId, status);
	}
}

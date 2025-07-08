// application/use‑cases/session/pay‑session‑with‑wallet.usecase.ts
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IPaySessionWithWalletUseCase } from "../../../interfaces/session";

import { SessionPaymentStatus, SessionStatus } from "../../../../domain/entities/session.entity";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";
import { TransactionPurposeEnum } from "../../../interfaces/enums/transaction.purpose.enum";

export class PaySessionWithWalletUseCase implements IPaySessionWithWalletUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: SessionPaymentStatus, status: SessionStatus): Promise<void> {
		/* Fetch the session */
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		/* Check if session is expired */
		const sessionDate = new Date(session.date);
		const [hour, minute] = session.time.split(":").map(Number);
		sessionDate.setHours(hour);
		sessionDate.setMinutes(minute);
		if (sessionDate.getTime() < Date.now()) {
			throw new Error("Session is already expired. You cannot make payment.");
		}

		/* Validate participant */
		const participant = session.participants.find((p) => p.user.id === userId);
		if (!participant) throw new Error("Unauthorized: User is not a participant in this session");
		if (participant.paymentStatus === "completed") throw new Error("Session already booked");

		/* Calculate fees */
		const sessionFee = session.fee;
		const mentorId = session.mentor.id;
		const platformFeeFixed = 40;
		const platformCommission = sessionFee * 0.15;
		const totalPlatformFee = platformFeeFixed + platformCommission;
		const mentorEarning = sessionFee - totalPlatformFee;

		/* Check user wallet balance */
		const userWallet = await this.walletRepo.findWalletByUserId(userId);
		if (!userWallet || userWallet.balance < sessionFee) {
			throw new Error("Insufficient wallet balance");
		}

		/* Wallet operations */
		await this.walletRepo.updateBalance(userId, sessionFee, TransactionsTypeEnum.DEBIT); // debit user
		await this.walletRepo.updateBalance(mentorId, mentorEarning, TransactionsTypeEnum.CREDIT); // credit mentor

		const platformWallet = await this.walletRepo.platformWallet();
		await this.walletRepo.updateBalance(platformWallet.userId, totalPlatformFee, TransactionsTypeEnum.CREDIT, RoleEnum.ADMIN); // credit platform

		/* Transactions */
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: mentorId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.MENTOR,
			amount: sessionFee,
			type: TransactionsTypeEnum.DEBIT,
			purpose: TransactionPurposeEnum.SESSION_FEE,
			description: `Payment for session ${session.topic}`,
			sessionId,
		});

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

		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: platformFeeFixed,
			type: TransactionsTypeEnum.CREDIT,
			purpose: TransactionPurposeEnum.PLATFORM_FEE,
			description: `Platform fixed fee from session ${session.topic}`,
			sessionId,
		});

		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: platformCommission,
			type: TransactionsTypeEnum.CREDIT,
			purpose: TransactionPurposeEnum.PLATFORM_FEE,
			description: `Platform 15% commission from session ${session.topic}`,
			sessionId,
		});

		/* Mark payment in session */
		await this.sessionRepo.markPayment(sessionId, userId, paymentStatus, paymentId, status);
	}
}

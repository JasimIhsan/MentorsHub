import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IPaySessionWithGatewayUseCase } from "../../../interfaces/session";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";
import { TransactionPurposeEnum } from "../../../interfaces/enums/transaction.purpose.enum";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";

export class PaySessionWithGatewayUseCase implements IPaySessionWithGatewayUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: SessionPaymentStatusEnum, status: SessionStatusEnum): Promise<void> {
		// 1. Get session
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// 2. Validate session datetime
		const sessionDate = new Date(session.date);
		const [hour, minute] = session.time.split(":").map(Number);
		sessionDate.setHours(hour);
		sessionDate.setMinutes(minute);
		if (sessionDate.getTime() < Date.now()) {
			throw new Error("Session is already expired. You cannot make payment.");
		}

		// 3. Get participant
		const participant = session.participants.find((p) => p.user.id === userId);
		if (!participant) throw new Error("Unauthorized");
		if (participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) {
			throw new Error("Already paid for this session");
		}

		// 4. Get mentor & platform
		const mentorId = session.mentor.id;
		const platformWallet = await this.walletRepo.platformWallet();

		// 5. Total amount user paid (stored in session.fee)
		const totalPaid = session.totalAmount; // 💰 this includes platform fee + mentor earning

		const platformFeeFixed = 40;
		const platformCommission = session.fee * 0.15;
		const totalPlatformFee = platformFeeFixed + platformCommission;

		// 6. Calculate mentor earning
		const mentorEarning = Math.max(totalPaid - totalPlatformFee, 0);

		// 7. Credit Mentor (if any)
		if (mentorEarning > 0) {
			await this.walletRepo.updateBalance(mentorId, mentorEarning, TransactionsTypeEnum.CREDIT);
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

		// 8. Credit platform (fixed + commission)
		await this.walletRepo.updateBalance(platformWallet.userId, totalPlatformFee, TransactionsTypeEnum.CREDIT, RoleEnum.ADMIN);

		// a. Fixed ₹40
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: platformFeeFixed,
			type: TransactionsTypeEnum.CREDIT,
			purpose: TransactionPurposeEnum.PLATFORM_FEE,
			description: `Fixed fee from session ${session.topic}`,
			sessionId,
		});

		// b. 15% Commission
		if(platformCommission > 0) {
			await this.walletRepo.createTransaction({
				fromUserId: userId,
				toUserId: platformWallet.userId,
				fromRole: RoleEnum.USER,
				toRole: RoleEnum.ADMIN,
				amount: platformCommission,
				type: TransactionsTypeEnum.CREDIT,
				purpose: TransactionPurposeEnum.PLATFORM_COMMISSION,
				description: `Commission from session ${session.topic}`,
				sessionId,
			});
		}

		// 9. Mark session payment
		await this.sessionRepo.markPayment(sessionId, userId, paymentStatus, paymentId, status);
	}
}

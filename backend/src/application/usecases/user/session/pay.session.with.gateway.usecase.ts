import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IPaySessionWithGatewayUseCase } from "../../../interfaces/session";
import { SessionPaymentStatus, SessionStatus } from "../../../../domain/entities/session.entity";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";

export class PaySessionWithGatewayUseCase implements IPaySessionWithGatewayUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: SessionPaymentStatus, status: SessionStatus): Promise<void> {
		// Get session
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// Validate date and time (not expired)
		const sessionDate = new Date(session.date);
		const [hour, minute] = session.time.split(":").map(Number);
		sessionDate.setHours(hour);
		sessionDate.setMinutes(minute);

		if (sessionDate.getTime() < Date.now()) {
			throw new Error("Session is already expired. You cannot make payment.");
		}

		// Find the participant
		const participant = session.participants.find((p) => p.user.id === userId);
		if (!participant) throw new Error("Unauthorized");
		if (participant.paymentStatus === "completed") throw new Error("Already paid for this session");

		// Calculate payment distribution
		const sessionFee = session.fee;
		const mentorId = session.mentor.id;

		const platformFeeFixed = 40;
		const platformCommission = sessionFee * 0.15;
		const totalPlatformFee = platformFeeFixed + platformCommission;
		const mentorEarning = sessionFee - totalPlatformFee;

		// Credit mentor
		await this.walletRepo.updateBalance(mentorId, mentorEarning, TransactionsTypeEnum.CREDIT);

		// Credit platform
		const platformWallet = await this.walletRepo.platformWallet();
		await this.walletRepo.updateBalance(platformWallet.userId, totalPlatformFee, TransactionsTypeEnum.CREDIT, RoleEnum.ADMIN);

		// Create transactions

		//  Mentor receives their share
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: mentorId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.MENTOR,
			amount: mentorEarning,
			type: TransactionsTypeEnum.CREDIT,
			purpose: "session_fee",
			description: `Mentor earning for session ${session.topic}`,
			sessionId,
		});

		//  Admin receives fixed ₹40
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: platformFeeFixed,
			type: TransactionsTypeEnum.CREDIT,
			purpose: "platform_fee",
			description: `Fixed fee from session ${session.topic}`,
			sessionId,
		});

		//  Admin receives 15% commission
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: platformCommission,
			type: TransactionsTypeEnum.CREDIT,
			purpose: "platform_fee",
			description: `15% commission from session ${session.topic}`,
			sessionId,
		});

		// Update session payment details
		await this.sessionRepo.markPayment(sessionId, userId, paymentStatus, paymentId, status);
	}
}

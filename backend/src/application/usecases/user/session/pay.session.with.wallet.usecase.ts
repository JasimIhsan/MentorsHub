import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IPaySessionWithWalletUseCase } from "../../../interfaces/session";

export class PaySessionWithWalletUseCase implements IPaySessionWithWalletUseCase {
	constructor(private sessionRepo: ISessionRepository, private walletRepo: IWalletRepository) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void> {
		// 1. Fetch the session details
		const session = await this.sessionRepo.getSessionById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// Check if session is expired
		const sessionDate = new Date(session.getDate());
		const [hour, minute] = session.getTime().split(":").map(Number);
		sessionDate.setHours(hour);
		sessionDate.setMinutes(minute);

		if (sessionDate.getTime() < Date.now()) {
			throw new Error("Session is already expired. You cannot make payment.");
		}

		const user = session.getParticipants().find((p) => p.userId === userId);
		if (!user) throw new Error("Unauthorized: User is not a participant in this session");
		if (user.paymentStatus === "completed") throw new Error("Session already booked");

		const sessionFee = session.getfee();
		const mentorId = session.getMentorId();
		const platformFeeFixed = 40;
		const platformCommission = sessionFee * 0.15;
		const totalPlatformFee = platformFeeFixed + platformCommission;
		const mentorEarning = sessionFee - totalPlatformFee;

		// 2. Check user wallet balance
		const userWallet = await this.walletRepo.findWalletByUserId(userId);
		if (!userWallet || userWallet.balance < sessionFee) {
			throw new Error("Insufficient wallet balance");
		}

		// 3. Debit user wallet
		await this.walletRepo.updateBalance(userId, sessionFee, "debit");

		// 4. Credit mentor wallet
		await this.walletRepo.updateBalance(mentorId, mentorEarning, "credit");

		const platformWallet = await this.walletRepo.platformWallet();
		await this.walletRepo.updateBalance(platformWallet.userId, totalPlatformFee, "credit", "admin");

		// 6. Create transactions

		// a. User pays session fee
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: mentorId,
			fromRole: "user",
			toRole: "mentor",
			amount: sessionFee,
			type: "debit",
			purpose: "session_fee",
			description: `Payment for session ${session.getTopic()}`,
			sessionId,
		});

		// b. Mentor receives 85%
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: mentorId,
			fromRole: "user",
			toRole: "mentor",
			amount: mentorEarning,
			type: "credit",
			purpose: "session_fee",
			description: `Mentor earning for session ${session.getTopic()}`,
			sessionId,
		});

		// c. Admin gets platform fee (₹40)
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: "user",
			toRole: "admin",
			amount: platformFeeFixed,
			type: "credit",
			purpose: "platform_fee",
			description: `Platform fixed fee from session ${session.getTopic()}`,
			sessionId,
		});

		// d. Admin gets 15% commission
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: "user",
			toRole: "admin",
			amount: platformCommission,
			type: "credit",
			purpose: "platform_fee",
			description: `Platform 15% commission from session ${session.getTopic()}`,
			sessionId,
		});

		// 7. Update session payment status
		await this.sessionRepo.paySession(sessionId, userId, paymentId, paymentStatus, status);
	}
}

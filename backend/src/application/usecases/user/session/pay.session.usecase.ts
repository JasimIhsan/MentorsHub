import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { IPaySessionUseCase } from "../../../interfaces/session";

export class PaySessionUseCase implements IPaySessionUseCase {
	constructor(private sessionRepo: ISessionRepository, private walletRepo: IWalletRepository) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void> {
		// 1. Fetch the session details
		const session = await this.sessionRepo.getSessionById(sessionId);
		console.log("session in pay session usecase: ", session);
		if (!session) throw new Error("Session not found");
		const user = session.getParticipants().find((p) => p.userId === userId);
		if (!user) throw new Error("Unauthorized: User is not a participant in this session");
		if (user.paymentStatus === "completed") throw new Error("Session already booked");

		const sessionFee = session.getfee();
		const mentorId = session.getMentorId();
		const platformFeeFixed = 40;
		const platformCommission = sessionFee * 0.15; // round to nearest int
		const totalPlatformFee = platformFeeFixed + platformCommission;
		const mentorEarning = sessionFee - totalPlatformFee;

		// 2. Check user wallet balance
		const userWallet = await this.walletRepo.findWalletByUserId(userId);
		if (!userWallet || userWallet.getBalance() < sessionFee) {
			throw new Error("Insufficient wallet balance");
		}

		// 3. Debit user wallet
		const usewalet = await this.walletRepo.updateBalance(userId, sessionFee, "debit");
		console.log("usewalet: ", usewalet);

		// 4. Credit mentor wallet
		const mentorWallet = await this.walletRepo.updateBalance(mentorId, mentorEarning, "credit");
		console.log("mentorWallet: ", mentorWallet);

		const platformWallet = await this.walletRepo.platformWallet();
		const adminWallet = await this.walletRepo.updateBalance(platformWallet.getUserId(), totalPlatformFee, "credit", "admin");
		console.log("adminWallet: ", adminWallet);

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
			toUserId: platformWallet.getUserId(),
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
			toUserId: platformWallet.getUserId(),
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

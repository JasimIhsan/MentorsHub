import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IPaySessionWithGatewayUseCase } from "../../../interfaces/session";

export class PaySessionWithGatewayUseCase implements IPaySessionWithGatewayUseCase {
	constructor(private sessionRepo: ISessionRepository, private walletRepo: IWalletRepository) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void> {
		const session = await this.sessionRepo.getSessionById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// ✅ Check if session is expired
		const sessionDate = new Date(session.getDate());
		const [hour, minute] = session.getTime().split(":").map(Number);
		sessionDate.setHours(hour);
		sessionDate.setMinutes(minute);

		if (sessionDate.getTime() < Date.now()) {
			throw new Error("Session is already expired. You cannot make payment.");
		}

		const user = session.getParticipants().find((p) => p.userId === userId);
		if (!user) throw new Error("Unauthorized");
		if (user.paymentStatus === "completed") throw new Error("Already is already paid");

		const sessionFee = session.getfee();
		const mentorId = session.getMentorId();

		const platformFeeFixed = 40;
		const platformCommission = sessionFee * 0.15;
		const totalPlatformFee = platformFeeFixed + platformCommission;
		const mentorEarning = sessionFee - totalPlatformFee;

		// ✅ Credit mentor wallet
		await this.walletRepo.updateBalance(mentorId, mentorEarning, "credit");

		// ✅ Credit platform wallet
		const platformWallet = await this.walletRepo.platformWallet();
		await this.walletRepo.updateBalance(platformWallet.getUserId(), totalPlatformFee, "credit", "admin");

		// ✅ Create transactions
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: mentorId,
			amount: mentorEarning,
			type: "credit",
			purpose: "session_fee",
			description: `Mentor earning for session ${session.getTopic()}`,
			sessionId,
			fromRole: "user",
			toRole: "mentor",
		});

		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.getUserId(),
			amount: platformFeeFixed,
			type: "credit",
			purpose: "platform_fee",
			description: `Fixed fee from session ${session.getTopic()}`,
			sessionId,
			fromRole: "user",
			toRole: "admin",
		});

		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.getUserId(),
			amount: platformCommission,
			type: "credit",
			purpose: "platform_fee",
			description: `15% commission from session ${session.getTopic()}`,
			sessionId,
			fromRole: "user",
			toRole: "admin",
		});

		// ✅ Update payment status
		await this.sessionRepo.paySession(sessionId, userId, paymentId, paymentStatus, status);
	}
}

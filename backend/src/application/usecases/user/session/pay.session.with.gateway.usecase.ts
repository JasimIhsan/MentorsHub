import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { INotifyUserUseCase } from "../../../interfaces/notification/notification.usecase";

import { IPaySessionWithGatewayUseCase } from "../../../interfaces/session";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { TransactionsTypeEnum } from "../../../interfaces/enums/transaction.type.enum";
import { TransactionPurposeEnum } from "../../../interfaces/enums/transaction.purpose.enum";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";

export class PaySessionWithGatewayUseCase implements IPaySessionWithGatewayUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly walletRepo: IWalletRepository, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: SessionPaymentStatusEnum, status: SessionStatusEnum): Promise<void> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// ⏰ Validate session time
		const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
		sessionDateTime.setMinutes(sessionDateTime.getMinutes() + 10);

		if (sessionDateTime.getTime() < Date.now()) {
			throw new Error("Payment time expired. The session has already started or ended.");
		}

		// 🧑‍🤝‍🧑 Validate participant
		const participant = session.participants.find((p) => p.user.id === userId);
		if (!participant) throw new Error("Unauthorized access to session");
		if (participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) {
			throw new Error("Payment already completed for this session.");
		}

		const mentorId = session.mentor.id;
		const totalAmount = session.totalAmount;

		// 💸 Platform fee calculation
		const platformFixedFee = 40;
		const platformCommission = session.fee * 0.15;
		const platformTotalFee = platformFixedFee + platformCommission;
		const mentorEarnings = Math.max(totalAmount - platformTotalFee, 0);

		// 🏦 Handle Wallets
		const platformWallet = await this.walletRepo.platformWallet();

		// 🔁 Mentor Wallet Update
		if (mentorEarnings > 0) {
			await this.walletRepo.updateBalance(mentorId, mentorEarnings, TransactionsTypeEnum.CREDIT);
			await this.walletRepo.createTransaction({
				fromUserId: userId,
				toUserId: mentorId,
				fromRole: RoleEnum.USER,
				toRole: RoleEnum.MENTOR,
				amount: mentorEarnings,
				type: TransactionsTypeEnum.CREDIT,
				purpose: TransactionPurposeEnum.SESSION_FEE,
				description: `Mentor earning for session "${session.topic}"`,
				sessionId,
			});
			await this.notifyUserUseCase.execute({
				title: "💰 Session Payout Received",
				message: `You've received ₹${mentorEarnings.toFixed(2)} for the session "${session.topic}".`,
				isRead: false,
				recipientId: mentorId,
				type: NotificationTypeEnum.PAYMENT,
			});
		}

		// 💼 Platform Wallet Update
		await this.walletRepo.updateBalance(platformWallet.userId, platformTotalFee, TransactionsTypeEnum.CREDIT, RoleEnum.ADMIN);

		// 🧾 Transactions for Platform
		await this.walletRepo.createTransaction({
			fromUserId: userId,
			toUserId: platformWallet.userId,
			fromRole: RoleEnum.USER,
			toRole: RoleEnum.ADMIN,
			amount: platformFixedFee,
			type: TransactionsTypeEnum.CREDIT,
			purpose: TransactionPurposeEnum.PLATFORM_FEE,
			description: `Fixed platform fee from session "${session.topic}"`,
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
				description: `Commission from session "${session.topic}"`,
				sessionId,
			});
		}

		// 🧾 Update session payment status
		await this.sessionRepo.markPayment(sessionId, userId, paymentStatus, paymentId, status);

		// ✅ Notify user
		await this.notifyUserUseCase.execute({
			title: "💰 Payment Successful",
			message: `Your payment of ₹${totalAmount.toFixed(2)} for the session "${session.topic}" was successful.`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.PAYMENT,
		});
	}
}

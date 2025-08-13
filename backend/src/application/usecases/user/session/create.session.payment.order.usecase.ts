import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { IPaymentGateway } from "../../../interfaces/services/payment.service";
import { ICreateSessionPaymentOrderUseCase } from "../../../interfaces/session";
import { v4 as uuidv4 } from "uuid";

export class CreateSessionPaymentOrderUseCase implements ICreateSessionPaymentOrderUseCase {
	constructor(private sessionRepo: ISessionRepository, private paymentGateway: IPaymentGateway) {}

	async execute(sessionId: string, userId: string): Promise<string> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		// Check if session is expired
		const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
		sessionDateTime.setMinutes(sessionDateTime.getMinutes() + 10);

		if (sessionDateTime.getTime() < Date.now()) {
			throw new Error("Payment time expired. The session has already started or ended.");
		}

		const participant = session.findParticipant(userId);
		if (!participant) throw new Error("Unauthorized: User is not a participant in this session");
		if (participant.paymentStatus === SessionPaymentStatusEnum.COMPLETED) throw new Error("Session already paid");

		const amount = session.totalAmount * 100;
		const receipt = `sess_${uuidv4().slice(0, 8)}`;
		const notes = { sessionId, userId };

		const order = await this.paymentGateway.createOrder(amount, receipt, notes);
		return order;
	}
}

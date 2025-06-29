import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IPaymentGateway } from "../../../interfaces/services/payment.service";
import { ICreateSessionPaymentOrderUseCase } from "../../../interfaces/session";
import { v4 as uuidv4 } from "uuid";

export class CreateSessionPaymentOrderUseCase implements ICreateSessionPaymentOrderUseCase {
	constructor(private sessionRepo: ISessionRepository, private paymentGateway: IPaymentGateway) {}

	async execute(sessionId: string, userId: string): Promise<string> {
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

		const participant = session.getParticipants().find((p) => p.userId === userId);
		if (!participant) throw new Error("Unauthorized: User is not a participant in this session");
		if (participant.paymentStatus === "completed") throw new Error("Session already paid");

		const amount = session.getfee() * 100;
		const receipt = `sess_${uuidv4().slice(0, 8)}`;
		const notes = { sessionId, userId };

		const order = await this.paymentGateway.createOrder(amount, receipt, notes);
		return order;
	}
}

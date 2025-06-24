import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IPaymentGateway } from "../../../interfaces/services/payment.service";
import { ICreateSessionPaymentOrderUseCase } from "../../../interfaces/session";
import { v4 as uuidv4 } from "uuid";

export class CreateSessionPaymentOrderUseCase implements ICreateSessionPaymentOrderUseCase {
	constructor(private sessionRepo: ISessionRepository, private paymentGateway: IPaymentGateway) {}

	async execute(sessionId: string, userId: string): Promise<string> {
		const session = await this.sessionRepo.getSessionById(sessionId);
		if (!session) throw new Error("Session not found");

		const participant = session.getParticipants().find((p) => p.userId === userId);
		if (!participant) throw new Error("Unauthorized");
		if (participant.paymentStatus === "completed") throw new Error("Session already paid");

		const amount = session.getfee() * 100;
		const receipt = `sess_${uuidv4().slice(0, 8)}`;
		const notes = { sessionId, userId };

		const order = await this.paymentGateway.createOrder(amount, receipt, notes);
		return order;
	}
}

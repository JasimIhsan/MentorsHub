import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IVerifySessionPaymentUseCase } from "../../../interfaces/session";

export class VerifySessionPaymentUseCase implements IVerifySessionPaymentUseCase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(sessionId: string, userId: string): Promise<boolean> {
		const session = await this.sessionRepo.getSessionById(sessionId);
		if (!session) throw new Error("Session not found");

		const user = session.getParticipants().find((p) => p.userId === userId);
		if (!user) throw new Error("Unauthorized: User is not a participant in this session");

		return user.paymentStatus === "pending";
	}
}

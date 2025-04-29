import { ISessionRepository } from "../../../../domain/dbrepository/session.repository";
import { IPaySessionUseCase } from "../../../interfaces/session";

export class PaySessionUseCase implements IPaySessionUseCase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void> {
		return await this.sessionRepo.paySession(sessionId, userId, paymentId, paymentStatus, status);
	}
}

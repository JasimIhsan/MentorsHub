import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IUpdateSessionStatusUseCase } from "../../interfaces/session";

export class UpdateSessionStatusUsecase implements IUpdateSessionStatusUseCase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(sessionId: string, status: string, rejectReason?: string): Promise<void> {
		await this.sessionRepo.updateSessionStatus(sessionId, status, rejectReason);
		return;
	}
}

import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IUpdateRequestStatusUseCase } from "../../interfaces/session";

export class UpdateRequestStatusUsecase implements IUpdateRequestStatusUseCase{
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(sessionId: string, status: string, rejectReason?: string): Promise<void> {
		return await this.sessionRepo.updateRequestStatus(sessionId, status, rejectReason);
	}
}

import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { IUpdateRequestStatusUseCase } from "../../interfaces/session";

export class UpdateRequestStatusUsecase implements IUpdateRequestStatusUseCase{
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(sessionId: string, status: string): Promise<void> {
		return await this.sessionRepo.updateRequestStatus(sessionId, status);
	}
}

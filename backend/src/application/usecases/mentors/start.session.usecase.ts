import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IStartSessionUsecase } from "../../interfaces/session";

export class StartSessionUsecase implements IStartSessionUsecase {
	constructor(private sessionRepo: ISessionRepository) {}

	execute(sessionId: string) {
		return this.sessionRepo.updateRequestStatus(sessionId, "active");
	}
}

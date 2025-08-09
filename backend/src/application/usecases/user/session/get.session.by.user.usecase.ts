import { IRescheduleRequestRepository } from "../../../../domain/repositories/reschedule.request.repository";
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { ISessionUserDTO, mapToUserSessionDTO } from "../../../dtos/session.dto";
import { IGetSessionByUserUseCase } from "../../../interfaces/session";

export class GetSessionByUserUseCase implements IGetSessionByUserUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly rescheduleRequestRepo: IRescheduleRequestRepository) {}

	async execute(sessionId: string, userId: string): Promise<ISessionUserDTO> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);
		if (session.participants.find((p) => p.user.id === userId) === undefined) throw new Error("Unauthorized: User is not a participant in this session");

		const rescheduleRequests = await this.rescheduleRequestRepo.findBySessionId(sessionId);

		return mapToUserSessionDTO(session, userId, rescheduleRequests ?? undefined);
	}
}

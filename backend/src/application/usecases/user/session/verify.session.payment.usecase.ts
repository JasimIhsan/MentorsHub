import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { IVerifySessionPaymentUseCase } from "../../../interfaces/usecases/session";

export class VerifySessionPaymentUseCase implements IVerifySessionPaymentUseCase {
	constructor(private sessionRepo: ISessionRepository) {}

	async execute(sessionId: string, userId: string): Promise<boolean> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		const user = session.findParticipant(userId);
		if (!user) throw new Error("Unauthorized: User is not a participant in this session");

		return user.paymentStatus === SessionPaymentStatusEnum.PENDING;
	}
}

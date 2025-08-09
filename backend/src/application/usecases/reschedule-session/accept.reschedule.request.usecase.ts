import { IRescheduleRequestRepository } from "../../../domain/repositories/reschedule.request.repository";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IAcceptRescheduleRequestUseCase } from "../../interfaces/reschedule.request";

export class AcceptRescheduleRequestUseCase implements IAcceptRescheduleRequestUseCase {
	constructor(private readonly rescheduleRequestRepo: IRescheduleRequestRepository, private readonly sessionRepo: ISessionRepository) {}

	async execute(userId: string, sessionId: string, isCounter: boolean): Promise<void> {
		console.log('isCounter: ', isCounter);
		// 1. Find the reschedule request
		const rescheduleRequest = await this.rescheduleRequestRepo.findBySessionId(sessionId);
		if (!rescheduleRequest) throw new Error("Reschedule request not found.");

		// 2. Accept proposal
		rescheduleRequest.acceptProposal(userId, isCounter);

		// 3. Determine which proposal to apply
		const proposal = isCounter ? rescheduleRequest.counterProposal : rescheduleRequest.currentProposal;

		if (!proposal) throw new Error("No proposal found to apply.");

		// 4. Update the session with the new date/time
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error("Session not found.");

		session.updateSchedule(proposal.proposedDate, proposal.proposedStartTime, proposal.proposedEndTime);

		console.log(`Session updated : `, session);
		console.log(`Reschedule request updated : `, rescheduleRequest);

		// 5. Save changes
		await this.sessionRepo.update(session);
		await this.rescheduleRequestRepo.update(rescheduleRequest);
	}
}

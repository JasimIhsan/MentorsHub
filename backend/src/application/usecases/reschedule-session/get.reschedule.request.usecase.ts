import { RescheduleRequestEntity } from "../../../domain/entities/reschedule.request.entity";
import { IRescheduleRequestRepository } from "../../../domain/repositories/reschedule.request.repository";

export class GetRescheduleRequestUseCase {
	constructor(private rescheduleRequestRepo: IRescheduleRequestRepository) {}

	async execute(sessionId: string): Promise<RescheduleRequestEntity | null> {
		return await this.rescheduleRequestRepo.findBySessionId(sessionId);
	}
}

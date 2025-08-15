import { RescheduleStatusEnum } from "../../application/interfaces/enums/reschedule.status.enum";
import { RescheduleRequestEntity } from "../entities/reschedule.request.entity";

export interface IRescheduleRequestRepository {
	create(entity: RescheduleRequestEntity): Promise<RescheduleRequestEntity>;
	findById(id: string): Promise<RescheduleRequestEntity | null>;
	findBySessionIds(ids: string[]): Promise<RescheduleRequestEntity[]>;
	findBySessionId(sessionId: string): Promise<RescheduleRequestEntity | null>;
	findByMentorId(mentorId: string, filters: { page: number; limit: number, status?: RescheduleStatusEnum }): Promise<RescheduleRequestEntity[]>;
	update(entity: RescheduleRequestEntity): Promise<void>;
	delete(id: string): Promise<void>;
}

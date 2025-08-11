import { session } from "passport";
import { RescheduleStatusEnum } from "../../../application/interfaces/enums/reschedule.status.enum";
import { RescheduleRequestEntity } from "../../../domain/entities/reschedule.request.entity";
import { IRescheduleRequestRepository } from "../../../domain/repositories/reschedule.request.repository";
import { sessionRepository } from "../../composer";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { RescheduleRequestModel } from "../models/session/reschedule.request.model";
import { SessionModel } from "../models/session/session.model";

export class RescheduleRequestRepositoryImpl implements IRescheduleRequestRepository {
	async create(entity: RescheduleRequestEntity): Promise<RescheduleRequestEntity> {
		try {
			const rescheduleRequestDocument = RescheduleRequestEntity.toObject(entity);
			const rescheduleRequest = await RescheduleRequestModel.create(rescheduleRequestDocument);
			return RescheduleRequestEntity.fromDbDocument(rescheduleRequest);
		} catch (error) {
			return handleExceptionError(error, "Error creating reschedule request");
		}
	}

	async findById(id: string): Promise<RescheduleRequestEntity | null> {
		try {
			const rescheduleRequest = await RescheduleRequestModel.findById(id);
			return rescheduleRequest ? RescheduleRequestEntity.fromDbDocument(rescheduleRequest) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding reschedule request by ID");
		}
	}

	async findBySessionId(sessionId: string): Promise<RescheduleRequestEntity | null> {
		try {
			const rescheduleRequests = await RescheduleRequestModel.findOne({ sessionId });
			return rescheduleRequests ? RescheduleRequestEntity.fromDbDocument(rescheduleRequests) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding reschedule requests by session ID");
		}
	}

	async findBySessionIds(ids: string[]): Promise<RescheduleRequestEntity[]> {
		try {
			const rescheduleRequests = await RescheduleRequestModel.find({ sessionId: { $in: ids } });
			return rescheduleRequests.map((rescheduleRequest) => RescheduleRequestEntity.fromDbDocument(rescheduleRequest));
		} catch (error) {
			return handleExceptionError(error, "Error finding reschedule requests by session IDs");
		}
	}

	async update(entity: RescheduleRequestEntity): Promise<void> {
		try {
			const rescheduleRequestDocument = RescheduleRequestEntity.toObject(entity);
			await RescheduleRequestModel.findByIdAndUpdate(entity.id, rescheduleRequestDocument);
		} catch (error) {
			return handleExceptionError(error, "Error updating reschedule request");
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await RescheduleRequestModel.findByIdAndDelete(id);
		} catch (error) {
			return handleExceptionError(error, "Error deleting reschedule request");
		}
	}

	async findByMentorId(mentorId: string, filters: { page: number; limit: number; status?: RescheduleStatusEnum }): Promise<RescheduleRequestEntity[]> {
		try {
			const skip = (filters.page - 1) * filters.limit;

			const sessions = await SessionModel.find({ mentorId }, { _id: 1 }).lean();
			const sessionIds = sessions.map((session) => session._id);

			const query: any = {
				sessionId: { $in: sessionIds },
			};

			if (filters.status) {
				query.status = filters.status;
			}

			const requests = await RescheduleRequestModel.find(query).skip(skip).limit(filters.limit).lean();

			return requests.map(RescheduleRequestEntity.fromDbDocument);
		} catch (error) {
			return handleExceptionError(error, "Error finding reschedule requests by initiator");
		}
	}
}

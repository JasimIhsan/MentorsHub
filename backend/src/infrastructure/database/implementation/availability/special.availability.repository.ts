import { SpecialAvailabilityEntity } from "../../../../domain/entities/availability/special.availability.entity";
import { ISpecialAvailabilityRepository } from "../../../../domain/repositories/availability/special.availabiltity.repository";
import { handleExceptionError } from "../../../utils/handle.exception.error";
import { SpecialAvailabilityModel } from "../../models/availability/special.availability.model";

export class SpecialAvailabilityRepositoryImpl implements ISpecialAvailabilityRepository {
	async create(entity: SpecialAvailabilityEntity): Promise<SpecialAvailabilityEntity> {
		try {
			const slot = await SpecialAvailabilityModel.create(SpecialAvailabilityEntity.toObject(entity));
			return SpecialAvailabilityEntity.fromDbDocument(slot);
		} catch (error) {
			return handleExceptionError(error, "Error adding availability slot");
		}
	}

	async findById(id: string): Promise<SpecialAvailabilityEntity | null> {
		try {
			const doc = await SpecialAvailabilityModel.findById(id);
			return doc ? SpecialAvailabilityEntity.fromDbDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding availability slot by ID");
		}
	}

	async findByMentorId(mentorId: string): Promise<SpecialAvailabilityEntity[]> {
		try {
			const docs = await SpecialAvailabilityModel.find({ mentorId });
			return docs.map(SpecialAvailabilityEntity.fromDbDocument);
		} catch (error) {
			return handleExceptionError(error, "Error finding availability slots by mentor ID");
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await SpecialAvailabilityModel.findByIdAndDelete(id);
		} catch (error) {
			handleExceptionError(error, "Error deleting availability slot");
		}
	}

	async update(entity: SpecialAvailabilityEntity): Promise<void> {
		try {
			await SpecialAvailabilityModel.findByIdAndUpdate(entity.id, SpecialAvailabilityEntity.toObject(entity));
		} catch (error) {
			handleExceptionError(error, "Error updating availability slot");
		}
	}

	async isExists(mentorId: string, date: Date, startTime: string, endTime: string): Promise<boolean> {
		try {
			const exists = await SpecialAvailabilityModel.exists({ mentorId, date, $or: [{ startTime }, { endTime }] });
			return !!exists;
		} catch (error) {
			handleExceptionError(error, "Error checking overlapping availability slots");
			return false;
		}
	}
}

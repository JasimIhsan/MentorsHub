import { WeeklyAvailabilityEntity } from "../../../../domain/entities/availability/weekly.availability.entity";
import { IWeeklyAvailabilityRepository } from "../../../../domain/repositories/availability.repository";
import { handleExceptionError } from "../../../utils/handle.exception.error";
import { WeeklyAvailabilityModel } from "../../models/availability/weekly.availability.model";

export class WeeklyAvailabilityRepositoryImpl implements IWeeklyAvailabilityRepository {
	async create(entity: WeeklyAvailabilityEntity): Promise<void> {
		try {
			await WeeklyAvailabilityModel.create(WeeklyAvailabilityEntity.toObject(entity));
		} catch (error) {
			handleExceptionError(error, "Error adding availability slot");
		}
	}

	async findById(id: string): Promise<WeeklyAvailabilityEntity | null> {
		try {
			const doc = await WeeklyAvailabilityModel.findById(id);
			return doc ? WeeklyAvailabilityEntity.fromDbDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding availability slot by ID");
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await WeeklyAvailabilityModel.findByIdAndDelete(id);
		} catch (error) {
			handleExceptionError(error, "Error deleting availability slot");
		}
	}

	async update(entity: WeeklyAvailabilityEntity): Promise<void> {
		try {
			await WeeklyAvailabilityModel.findByIdAndUpdate(entity.id, WeeklyAvailabilityEntity.toObject(entity));
		} catch (error) {
			handleExceptionError(error, "Error updating availability slot");
		}
	}

	async isExists(mentorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<boolean> {
		try {
			const exists = await WeeklyAvailabilityModel.exists({
				mentorId,
				dayOfWeek,
				$or: [
					// 1. New startTime is in existing slot
					{
						startTime: { $lte: startTime },
						endTime: { $gt: startTime },
					},
					// 2. New endTime is in existing slot
					{
						startTime: { $lt: endTime },
						endTime: { $gte: endTime },
					},
					// 3. New slot fully overlaps existing
					{
						startTime: { $gte: startTime },
						endTime: { $lte: endTime },
					},
				],
			});
			return !!exists;
		} catch (error) {
			handleExceptionError(error, "Error checking overlapping availability slots");
			return false;
		}
	}

	async findAllByMentorId(mentorId: string): Promise<WeeklyAvailabilityEntity[]> {
		try {
			const docs = await WeeklyAvailabilityModel.find({ mentorId });
			return docs.map(WeeklyAvailabilityEntity.fromDbDocument);
		} catch (error) {
			return handleExceptionError(error, "Error finding availability slots by mentor ID");
		}
	}

	async toggleAvailabilityByWeekDay(mentorId: string, dayOfWeek: number, status: boolean): Promise<void> {
		try {
			await WeeklyAvailabilityModel.updateMany({ mentorId, dayOfWeek }, { $set: { isActive: status } });
		} catch (error) {
			handleExceptionError(error, "Error toggling availability by week day");
		}
	}
}

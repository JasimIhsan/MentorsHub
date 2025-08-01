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
}

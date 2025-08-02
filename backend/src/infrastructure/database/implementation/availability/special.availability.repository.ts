import { SpecialAvailabilityEntity } from "../../../../domain/entities/availability/special.availability.entity";
import { ISpecialAvailabilityRepository } from "../../../../domain/repositories/availability/special.availabiltity.repository";
import { handleExceptionError } from "../../../utils/handle.exception.error";
import { SpecialAvailabilityModel } from "../../models/availability/special.availability.model";

export class SpecialAvailabilityRepositoryImpl implements ISpecialAvailabilityRepository {
	async create(entity: SpecialAvailabilityEntity): Promise<void> {
		try {
			await SpecialAvailabilityModel.create(SpecialAvailabilityEntity.toObject(entity));
		} catch (error) {
			handleExceptionError(error, "Error adding availability slot");
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
}

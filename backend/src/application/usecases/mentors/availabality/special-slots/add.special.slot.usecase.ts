import { SpecialAvailabilityEntity } from "../../../../../domain/entities/availability/special.availability.entity";
import { ISpecialAvailabilityRepository } from "../../../../../domain/repositories/availability/special.availabiltity.repository";
import { IWeeklyAvailabilityRepository } from "../../../../../domain/repositories/availability/weekly.availability.repository";
import { ISpecialAvailabilityDTO, mapToISpecialAvailabilityDTO } from "../../../../dtos/availability/special.availability.dto";
import { IAddSpecialSlotUseCase } from "../../../../interfaces/usecases/mentors/mentor.availability.interfaces";

export class AddSpecialSlotUseCase implements IAddSpecialSlotUseCase {
	constructor(private readonly _specialRepo: ISpecialAvailabilityRepository, private readonly _weekRepo: IWeeklyAvailabilityRepository) {}

	async execute(mentorId: string, date: Date, startTime: string, endTime: string): Promise<ISpecialAvailabilityDTO> {
		const entity = new SpecialAvailabilityEntity({
			id: "",
			mentorId,
			date,
			startTime,
			endTime,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const dayOfWeek = entity.date.getDay();
		const exists = await this._weekRepo.isExists(mentorId, dayOfWeek, startTime, endTime);
		if (exists) throw new Error("Slot already exists or overlaps existing weekly slots");

		const isExists = await this._specialRepo.isExists(mentorId, date, startTime, endTime);
		if (isExists) throw new Error("Slot already exists or overlaps existing special slots");

		const slot = await this._specialRepo.create(entity);
		return mapToISpecialAvailabilityDTO(slot);
	}
}

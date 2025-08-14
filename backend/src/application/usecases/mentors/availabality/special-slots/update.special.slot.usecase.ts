import { ISpecialAvailabilityRepository } from "../../../../../domain/repositories/availability/special.availabiltity.repository";
import { IWeeklyAvailabilityRepository } from "../../../../../domain/repositories/availability/weekly.availability.repository";
import { IUpdateSpecialSlotUseCase } from "../../../../interfaces/usecases/mentors/mentor.availability.interfaces";

export class UpdateSpecialSlotUseCase implements IUpdateSpecialSlotUseCase {
	constructor(private readonly _specialRepo: ISpecialAvailabilityRepository, private readonly _weekRepo: IWeeklyAvailabilityRepository) {}

	async execute(slotId: string, mentorId: string, startTime: string, endTime: string): Promise<void> {
		const slot = await this._specialRepo.findById(slotId);
		if (!slot) throw new Error("Slot not found");
		if (slot.mentorId !== mentorId) throw new Error("Slot does not belong to the mentor");

		const isExists = await this._specialRepo.isExists(mentorId, slot.date, startTime, endTime);
		if (isExists) throw new Error("Slot already exists or overlaps existing special slots");

		const dayOfWeek = slot.date.getDay();
		const exists = await this._weekRepo.isExists(mentorId, dayOfWeek, startTime, endTime);
		if (exists) throw new Error("Slot already exists or overlaps existing weekly slots");

		slot.startTime = startTime;
		slot.endTime = endTime;
		await this._specialRepo.update(slot);
	}
}

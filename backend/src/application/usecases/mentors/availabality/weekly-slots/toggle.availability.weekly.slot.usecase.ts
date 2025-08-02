import { IWeeklyAvailabilityRepository } from "../../../../../domain/repositories/availability/weekly.availability.repository";
import { IToggleAvailabilityWeeklySlotUseCase } from "../../../../interfaces/mentors/mentor.availability.interfaces";

export class ToggleAvailabilityWeeklySlotUseCase implements IToggleAvailabilityWeeklySlotUseCase {
	constructor(private readonly _weekRepo: IWeeklyAvailabilityRepository) {}

	async execute(id: string, mentorId: string): Promise<void> {
		const slot = await this._weekRepo.findById(id);
		if (!slot) throw new Error("Slot not found");
		if (slot.mentorId !== mentorId) throw new Error("Slot does not belong to the mentor");

		slot.isActive = !slot.isActive;
		await this._weekRepo.update(slot);
	}
}

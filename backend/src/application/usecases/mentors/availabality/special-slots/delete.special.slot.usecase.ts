import { ISpecialAvailabilityRepository } from "../../../../../domain/repositories/availability/special.availabiltity.repository";
import { IDeleteSpecialSlotUseCase } from "../../../../interfaces/mentors/mentor.availability.interfaces";

export class DeleteSpecialSlotUseCase implements IDeleteSpecialSlotUseCase {
	constructor(private readonly _specialRepo: ISpecialAvailabilityRepository) {}

	async execute(slotId: string, mentorId: string): Promise<void> {
		const slot = await this._specialRepo.findById(slotId);
		if (!slot) throw new Error("Slot not found");
		if (slot.mentorId !== mentorId) throw new Error("Slot does not belong to the mentor");

		await this._specialRepo.delete(slotId);
	}
}

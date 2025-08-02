import { IWeeklyAvailabilityRepository } from "../../../../domain/repositories/availability.repository";
import { IToggleAvailabilityByWeekDayUseCase } from "../../../interfaces/mentors/mentor.availability.interfaces";

export class ToggleAvailabilityByWeekDayUseCase implements IToggleAvailabilityByWeekDayUseCase {
	constructor(private readonly _weekRepo: IWeeklyAvailabilityRepository) {}

	async execute(mentorId: string, dayOfWeek: number, status: boolean): Promise<void> {
		await this._weekRepo.toggleAvailabilityByWeekDay(mentorId, dayOfWeek, status);
	}
}

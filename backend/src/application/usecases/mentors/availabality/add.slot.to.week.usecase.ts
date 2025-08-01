import { WeeklyAvailabilityEntity } from "../../../../domain/entities/availability/weekly.availability.entity";
import { IWeeklyAvailabilityRepository } from "../../../../domain/repositories/availability.repository";
import { IAddSlotAvailabilityToWeekUseCase } from "../../../interfaces/mentors/mentor.availability.interfaces";

export class AddSlotAvailabilityToWeekUseCase implements IAddSlotAvailabilityToWeekUseCase {
	constructor(private readonly _weekRepo: IWeeklyAvailabilityRepository) {}

	async execute(mentorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<void> {
		const entity = new WeeklyAvailabilityEntity({
			id: "",
			mentorId,
			dayOfWeek,
			startTime,
			endTime,
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await this._weekRepo.create(entity);
	}
}

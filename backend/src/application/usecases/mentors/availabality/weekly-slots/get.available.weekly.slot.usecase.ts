import { IWeeklyAvailabilityRepository } from "../../../../../domain/repositories/availability/weekly.availability.repository";
import { IWeeklyAvailabilityDTO, mapToWeeklyAvailabilityDTO } from "../../../../dtos/availability/weekly.availability.dto";
import { IGetAllWeeklyAvailabilityUseCase } from "../../../../interfaces/usecases/mentors/mentor.availability.interfaces";

export class GetAllWeeklyAvailabilityUseCase implements IGetAllWeeklyAvailabilityUseCase {
	constructor(private readonly _weekRepo: IWeeklyAvailabilityRepository) {}

	async execute(mentorId: string): Promise<IWeeklyAvailabilityDTO[]> {
		const slots = await this._weekRepo.findAllByMentorId(mentorId);
		return slots.map(mapToWeeklyAvailabilityDTO);
	}
}

import { ISpecialAvailabilityRepository } from "../../../../domain/repositories/availability/special.availabiltity.repository";
import { IWeeklyAvailabilityRepository } from "../../../../domain/repositories/availability/weekly.availability.repository";
import { IAvailabilityToUserDTO, mapToSpecialAvailabilityToUserDTO, mapToWeeklyAvailabilityToUserDTO } from "../../../dtos/availability/availability.to.user.dto";
import { IGetMentorAvailabilityToUserUseCase } from "../../../interfaces/usecases/mentors/mentor.availability.interfaces";

export class GetMentorAvailabilityToUserUseCase implements IGetMentorAvailabilityToUserUseCase {
	constructor(private readonly _specialRepo: ISpecialAvailabilityRepository, private readonly _weeklyRepo: IWeeklyAvailabilityRepository) {}

	async execute(mentorId: string): Promise<IAvailabilityToUserDTO> {
		const weekly = await this._weeklyRepo.findByMentorId(mentorId);
		if (!weekly) throw new Error("Weekly availability not found");

		const special = await this._specialRepo.findByMentorId(mentorId);
		if (!special) throw new Error("Special availability not found");

		return { weekly: weekly.map(mapToWeeklyAvailabilityToUserDTO), special: special.map(mapToSpecialAvailabilityToUserDTO) };
	}
}

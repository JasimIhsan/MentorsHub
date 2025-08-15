import { ISpecialAvailabilityRepository } from "../../../../../domain/repositories/availability/special.availabiltity.repository";
import { ISpecialAvailabilityDTO, mapToISpecialAvailabilityDTO } from "../../../../dtos/availability/special.availability.dto";
import { IGetSpecialSlotByMentorUseCase } from "../../../../interfaces/usecases/mentors/mentor.availability.interfaces";

export class GetSpecialSlotByMentorUseCase implements IGetSpecialSlotByMentorUseCase {
	constructor(private readonly _specialRepo: ISpecialAvailabilityRepository) {}

	async execute(mentorId: string): Promise<ISpecialAvailabilityDTO[]> {
		const slots = await this._specialRepo.findByMentorId(mentorId);
		return slots.map(mapToISpecialAvailabilityDTO);
	}
}

import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IMentorDTO } from "../../dtos/mentor.dtos";
import { IGetAllMentorsUseCase } from "../../interfaces/mentors/mentors.interface";

export class GetAllMentorsUseCase implements IGetAllMentorsUseCase {
	constructor(private mentorRepo: IMentorProfileRepository) {}

	async execute(): Promise<IMentorDTO[]> {
		const mentors = await this.mentorRepo.findAllMentors();
		return mentors;
	}
}

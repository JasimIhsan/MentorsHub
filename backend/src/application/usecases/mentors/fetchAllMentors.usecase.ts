import { IMentorProfileRepository } from "../../../domain/dbrepository/mentor.details.repository";
import { IMentorDTO } from "../../dtos/mentor.dtos";
import { IFetchAllMentorsUseCase } from "../../interfaces/mentors/mentors.interface";

export class FetchAllMentorsUseCase implements IFetchAllMentorsUseCase {
	constructor(private mentorRepo: IMentorProfileRepository) {}

	async execute(): Promise<IMentorDTO[]> {
		const mentors = await this.mentorRepo.findAllMentors();
		return mentors;
	}
}

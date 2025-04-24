import { IMentorProfileRepository } from "../../../domain/dbrepository/mentor.details.repository";
import { IMentorDTO } from "../../dtos/mentor.dtos";

export class FetchAllMentorsUseCase {
	constructor(private mentorRepo: IMentorProfileRepository) {}

	async execute(): Promise<IMentorDTO[]> {
		const mentors = await this.mentorRepo.findAllMentors();
		return mentors;
	}
}

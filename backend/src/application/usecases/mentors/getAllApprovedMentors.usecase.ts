import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IMentorDTO } from "../../dtos/mentor.dtos";
import { IGetAllApprovedMentorsUsecase } from "../../interfaces/mentors/mentors.interface";

export class GetAllApprovedMentorsUsecase implements IGetAllApprovedMentorsUsecase {
	constructor(private mentorRepository: IMentorProfileRepository) {}

	async execute(): Promise<IMentorDTO[]> {
		const mentors = await this.mentorRepository.findAllApprovedMentors();
		return mentors;
	}
}

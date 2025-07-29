import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IMentorDTO, mapToMentorDTOWithoutUser } from "../../dtos/mentor.dtos";
import { IGetAllApprovedMentorsUsecase } from "../../interfaces/mentors/mentors.interface";

export class GetAllApprovedMentorsUsecase implements IGetAllApprovedMentorsUsecase {
	constructor(private mentorRepository: IMentorProfileRepository) {}

	async execute(params: { page: number; limit: number; search?: string; sortBy?: string; priceMin?: number; priceMax?: number; skills?: string[] }, browserId: string): Promise<{ mentors: IMentorDTO[]; total: number; page: number; limit: number }> {
		const { mentors, total } = await this.mentorRepository.findAllApprovedMentors(params, browserId);

		return {
			mentors: mentors.map(mapToMentorDTOWithoutUser),
			total,
			page: params.page,
			limit: params.limit,
		};
	}
}

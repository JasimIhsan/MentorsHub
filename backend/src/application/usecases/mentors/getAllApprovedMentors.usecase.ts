import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { mapToMentorDTOWithoutUser } from "../../dtos/mentor.dtos";
import { IGetAllApprovedMentorsUsecase } from "../../interfaces/mentors/mentors.interface";

export class GetAllApprovedMentorsUsecase implements IGetAllApprovedMentorsUsecase {
	constructor(private mentorRepository: IMentorProfileRepository) {}

	async execute(params: { page: number; limit: number; search?: string; sortBy?: string; priceMin?: number; priceMax?: number; interests?: string[] }): Promise<{ mentors: any[]; total: number; page: number; limit: number }> {
		const { mentors, total } = await this.mentorRepository.findAllApprovedMentors(params);

		return {
			mentors: mentors.map(mapToMentorDTOWithoutUser),
			total,
			page: params.page,
			limit: params.limit,
		};
	}
}

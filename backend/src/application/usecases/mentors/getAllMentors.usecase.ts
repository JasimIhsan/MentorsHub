import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IMentorDTO, mapToMentorDTOWithoutUser } from "../../dtos/mentor.dtos";
import { IGetAllMentorsUsecase } from "../../interfaces/usecases/mentors/mentors.interface";

export class GetAllMentorsUseCase implements IGetAllMentorsUsecase {
	constructor(private mentorRepo: IMentorProfileRepository) {}

	async execute(query: { page?: number; limit?: number; search?: string; status?: string }): Promise<{
		mentors: IMentorDTO[];
		total: number;
		page: number;
		limit: number;
	}> {
		const page = query.page || 1;
		const limit = query.limit || 10;
		const { mentors, total } = await this.mentorRepo.findAllMentors(query);
		return { mentors: mentors.map(mapToMentorDTOWithoutUser), total, page, limit };
	}
}

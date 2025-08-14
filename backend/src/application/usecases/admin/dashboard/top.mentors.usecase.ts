import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { ITopFiveMentorsDTO } from "../../../dtos/admin.dashboard.dtos";
import { IGetTopMentorsUseCase } from "../../../interfaces/usecases/admin/admin.dashboard.interface";

export class GetTopMentorsUseCase implements IGetTopMentorsUseCase {
	constructor(private readonly _mentorRepo: IMentorProfileRepository) {}

	async execute(): Promise<ITopFiveMentorsDTO[]> {
		const mentors = await this._mentorRepo.getTopFiveMentors();

		return mentors.map((mentor) => {
			return {
				id: mentor.id,
				name: mentor.name,
				avatar: mentor.avatar,
				rating: mentor.averageRating,
				revenue: mentor.totalRevenue,
				sessions: mentor.totalSessions,
			};
		});
	}
}

import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IMentorDTO, mapToMentorDTOWithoutUser } from "../../dtos/mentor.dtos";
import { IGetMentorUsecase } from "../../interfaces/usecases/mentors/mentors.interface";

export class GetMentorUsecase implements IGetMentorUsecase {
	constructor(private mentorRepo: IMentorProfileRepository) {}

	async execute(userId: string): Promise<IMentorDTO | null> {
		const mentor = await this.mentorRepo.findMentorByUserId(userId);
		if (!mentor) throw new Error("Mentor not found");
		return mapToMentorDTOWithoutUser(mentor);
	}
}

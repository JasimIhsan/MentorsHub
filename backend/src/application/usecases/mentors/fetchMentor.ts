import { IMentorProfileRepository } from "../../../domain/dbrepository/mentor.details.repository";
import { IMentorDTO } from "../../dtos/mentor.dtos";
import { IFetchMentorUsecase } from "../../interfaces/mentors/mentors.interface";

export class FetchMentorUsecase implements IFetchMentorUsecase {
	constructor(private mentorRepo: IMentorProfileRepository) {}

	execute(userId: string): Promise<IMentorDTO | null> {
		const mentor = this.mentorRepo.findMentorByUserId(userId);
		if (!mentor) throw new Error("Mentor not found");
		return mentor;
	}
}

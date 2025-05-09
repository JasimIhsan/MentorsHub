import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IMentorDTO } from "../../dtos/mentor.dtos";
import { IGetMentorUsecase } from "../../interfaces/mentors/mentors.interface";

export class GetMentorUsecase implements IGetMentorUsecase {
	constructor(private mentorRepo: IMentorProfileRepository) {}

	execute(userId: string): Promise<IMentorDTO | null> {
		const mentor = this.mentorRepo.findMentorByUserId(userId);
		if (!mentor) throw new Error("Mentor not found");
		return mentor;
	}
}

import { MentorDetails } from "../entities/mentor.detailes.entity";

export interface IMentorDetailsRepository {
	create(mentorDetails: MentorDetails): Promise<MentorDetails>;
	update(userId: string, data: Partial<MentorDetails>): Promise<MentorDetails | null>;
	findByUserId(userId: string): Promise<MentorDetails | null>;
}

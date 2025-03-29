import { IMentorDetails } from "../entities/mentor.detailes.entity";

export interface IMentorDetailsRepository {
	create(mentorDetails: IMentorDetails): Promise<IMentorDetails>;
	update(userId: string, data: Partial<IMentorDetails>): Promise<IMentorDetails | null>;
	findByUserId(userId: string): Promise<IMentorDetails | null>;
}

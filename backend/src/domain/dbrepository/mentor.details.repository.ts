import { IMentorDTO } from "../../application/dtos/mentor.dtos";
import { IMentorInterface, MentorProfileEntity } from "../entities/mentor.detailes.entity";

export interface IMentorProfileRepository {
	findByUserId(userId: string): Promise<MentorProfileEntity | null>;
	updateByUserId(userId: string, updatedData: Partial<MentorProfileEntity>): Promise<MentorProfileEntity>;
	createMentorProfile(userId: string, data: MentorProfileEntity): Promise<MentorProfileEntity>;
	findAllMentors(): Promise<IMentorDTO[]>;
	findAllApprovedMentors(): Promise<IMentorDTO[]>;
	findMentorByUserId(userId: string): Promise<IMentorDTO | null>;
}

import { IAvailabilityDTO } from "../../application/dtos/availability.dto";
import { IMentorDTO } from "../../application/dtos/mentor.dtos";
import { IMentorInterface, MentorProfileEntity } from "../entities/mentor.detailes.entity";

export interface IMentorProfileRepository {
	findByUserId(userId: string): Promise<MentorProfileEntity | null>;
	createMentorProfile(userId: string, data: MentorProfileEntity): Promise<MentorProfileEntity>;
	updateMentorProfile(userId: string, updatedData: Partial<MentorProfileEntity>): Promise<MentorProfileEntity>;
	findAllMentors(query: { page?: number; limit?: number; search?: string; status?: string }): Promise<{
		mentors: IMentorDTO[];
		total: number;
	}>;
	findAllApprovedMentors(): Promise<IMentorDTO[]>;
	findMentorByUserId(userId: string): Promise<IMentorDTO | null>;
	getAvailability(userId: string): Promise<IAvailabilityDTO | null>;
}

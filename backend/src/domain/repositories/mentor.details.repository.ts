import { IAvailabilityDTO } from "../../application/dtos/availability.dto";
import { IMentorDTO } from "../../application/dtos/mentor.dtos";
import { MentorProfileEntity } from "../entities/mentor.detailes.entity";
import { MentorEntity } from "../entities/mentor.entity";

export interface IMentorProfileRepository {
	findByUserId(userId: string): Promise<MentorProfileEntity | null>;
	createMentorProfile(userId: string, data: MentorProfileEntity): Promise<MentorProfileEntity>;
	updateMentorProfile(userId: string, updatedData: Partial<MentorProfileEntity>): Promise<MentorProfileEntity>;
	findAllMentors(query: { page?: number; limit?: number; search?: string; status?: string }): Promise<{
		mentors: MentorEntity[];
		total: number;
	}>;
	findAllApprovedMentors(params: { page?: number; limit?: number; search?: string; sortBy?: string; priceMin?: number; priceMax?: number; interests?: string[] }): Promise<{mentors: MentorEntity[]; total: number}>;
	findMentorByUserId(userId: string): Promise<MentorEntity | null>;
	getAvailability(userId: string): Promise<IAvailabilityDTO | null>;
}

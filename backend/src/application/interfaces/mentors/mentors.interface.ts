import { PricingType } from "../../../domain/entities/session.entity";
import { IMentorDTO } from "../../dtos/mentor.dtos";
import { ISessionMentorDTO } from "../../dtos/session.dto";
import { SessionStatusEnum } from "../enums/session.status.enums";

export interface IGetAllMentorsUsecase {
	execute(query: { page?: number; limit?: number; search?: string; status?: string }): Promise<{
		mentors: IMentorDTO[];
		total: number;
		page: number;
		limit: number;
	}>;
}

export interface IGetAllApprovedMentorsUsecase {
	execute(params: { page?: number; limit?: number; search?: string; sortBy?: string; priceMin?: number; priceMax?: number; skills?: string[] }, browserId: string): Promise<{ mentors: IMentorDTO[]; total: number; page: number; limit: number }>;
}

export interface IGetMentorUsecase {
	execute(userId: string): Promise<IMentorDTO | null>;
}

export interface IGetSessionRequestsUseCase {
	execute(
		mentorId: string,
		queryParams: {
			status?: SessionStatusEnum;
			pricing?: PricingType;
			filterOption?: "today" | "week" | "all" | "free" | "paid";
			searchQuery?: string;
			page: number;
			limit: number;
		}
	): Promise<{ requests: ISessionMentorDTO[]; total: number }>;
}

export interface IGetAllMentorsUseCase {
	execute(mentorId: string): Promise<IMentorDTO[]>;
}

export interface IGetUpcomingSessionMentorUsecase {
	execute(
		mentorId: string,
		queryParams: {
			status?: SessionStatusEnum;
			filterOption?: "all" | "free" | "paid" | "today" | "week" | "month";
			page: number;
			limit: number;
		}
	): Promise<{ sessions: ISessionMentorDTO[]; total: number }>;
}

export interface IGetSessionHistoryUsecase {
	execute(mentorId: string, queryParams: { page: number; limit: number; status: SessionStatusEnum }): Promise<{ sessions: ISessionMentorDTO[]; total: number }>;
}

export interface IGetAvailabilityUseCase {
	execute(userId: string, dateStr: Date): Promise<string[]>;
}

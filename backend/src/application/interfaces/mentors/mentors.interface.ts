import { IAvailabilityDTO } from "../../dtos/availability.dto";
import { IMentorDTO } from "../../dtos/mentor.dtos";
import { ISessionMentorDTO, ISessionUserDTO } from "../../dtos/session.dto";

export interface IGetAllMentorsUsecase {
	execute(query: { page?: number; limit?: number; search?: string; status?: string }): Promise<{
		mentors: IMentorDTO[];
		total: number;
		page: number;
		limit: number;
	}>;
}

export interface IGetAllApprovedMentorsUsecase {
	execute(): Promise<IMentorDTO[]>;
}

export interface IGetMentorUsecase {
	execute(userId: string): Promise<IMentorDTO | null>;
}

export interface IGetSessionRequestsUseCase {
	execute(
		mentorId: string,
		queryParams: {
			status?: string;
			pricing?: string;
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
			status?: string;
			filterOption?: "all" | "free" | "paid" | "today" | "week" | "month";
			page: number;
			limit: number;
		}
	): Promise<{ sessions: ISessionMentorDTO[]; total: number }>;
}

export interface IGetSessionHistoryUsecase {
	execute(mentorId: string): Promise<ISessionMentorDTO[]>;
}

export interface IGetAvailabilityUseCase {
	execute(userId: string, dateStr: Date): Promise<string[]>;
}

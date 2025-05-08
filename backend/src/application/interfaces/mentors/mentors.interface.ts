import { IAvailabilityDTO } from "../../dtos/availability.dto";
import { IMentorDTO } from "../../dtos/mentor.dtos";
import { ISessionMentorDTO, ISessionUserDTO } from "../../dtos/session.dto";

export interface IGetAllMentorsUsecase {
	execute(): Promise<IMentorDTO[]>;
}

export interface IGetAllApprovedMentorsUsecase {
	execute(): Promise<IMentorDTO[]>;
}

export interface IGetMentorUsecase {
	execute(userId: string): Promise<IMentorDTO | null>;
}

export interface IGetSessionRequests {
	execute(mentorId: string): Promise<ISessionMentorDTO[]>
}

export interface IGetAllMentorsUseCase {
	execute(mentorId: string): Promise<IMentorDTO[]>
}

export interface IGetUpcomingSessionMentorUsecase {
	execute(mentorId: string): Promise<ISessionMentorDTO[]>
}

export interface IGetSessionHistoryUsecase {
	execute(mentorId: string): Promise<ISessionMentorDTO[]>
}

export interface IGetAvailabilityUseCase {
	execute(userId: string, dateStr: string): Promise<string[]>
}
import { IMentorDTO } from "../../dtos/mentor.dtos";
import { ISessionMentorDTO, ISessionUserDTO } from "../../dtos/session.dto";

export interface IFetchAllMentorsUsecase {
	execute(): Promise<IMentorDTO[]>;
}

export interface IFetchAllApprovedMentorsUsecase {
	execute(): Promise<IMentorDTO[]>;
}

export interface IFetchMentorUsecase {
	execute(userId: string): Promise<IMentorDTO | null>;
}

export interface IFetchSessionRequests {
	execute(mentorId: string): Promise<ISessionMentorDTO[]>
}
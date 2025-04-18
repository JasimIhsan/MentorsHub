import { IMentorDTO } from "../../dtos/mentor.dtos";

export interface IFetchAllMentorsUsecase {
	execute(): Promise<IMentorDTO[]>;
}

export interface IFetchAllApprovedMentorsUsecase {
	execute(): Promise<IMentorDTO[]>;
}

export interface IFetchMentorUsecase {
	execute(userId: string): Promise<IMentorDTO | null>;
}
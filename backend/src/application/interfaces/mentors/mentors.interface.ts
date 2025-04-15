import { IMentorDTO } from "../../dtos/mentor.dtos";

export interface IFetchAllMentorsUsecase {
	execute(): Promise<IMentorDTO[]>;
}
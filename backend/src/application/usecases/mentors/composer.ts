import { mentorRepository } from "../../../infrastructure/composer";
import { FetchAllApprovedMentorsUsecase } from "./fetchAllApprovedMentors";
import { FetchAllMentorsUseCase } from "./fetchAllMentors";
import { FetchMentorUsecase } from "./fetchMentor";

export const fetchAllMentorsUsecase = new FetchAllMentorsUseCase(mentorRepository);
export const fetchAllApprovedMentorsUsecase = new FetchAllApprovedMentorsUsecase(mentorRepository);
export const fetchMentorUsecase = new FetchMentorUsecase(mentorRepository)
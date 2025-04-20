import { mentorRepository } from "../../../infrastructure/composer";
import { FetchAllApprovedMentorsUsecase } from "./fetchAllApprovedMentors.usecase";
import { FetchAllMentorsUseCase } from "./fetchAllMentors.usecase";
import { FetchMentorUsecase } from "./fetchMentor.usecase";

export const fetchAllMentorsUsecase = new FetchAllMentorsUseCase(mentorRepository);
export const fetchAllApprovedMentorsUsecase = new FetchAllApprovedMentorsUsecase(mentorRepository);
export const fetchMentorUsecase = new FetchMentorUsecase(mentorRepository)
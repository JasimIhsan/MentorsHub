import { mentorRepository } from "../../../infrastructure/composer";
import { FetchAllApprovedMentorsUsecase } from "./fetchAllApprovedMentors";
import { FetchAllMentorsUseCase } from "./fetchAllMentors";

export const fetchAllMentorsUsecase = new FetchAllMentorsUseCase(mentorRepository);
export const fetchAllApprovedMentorsUsecase = new FetchAllApprovedMentorsUsecase(mentorRepository);

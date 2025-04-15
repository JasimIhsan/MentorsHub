import { mentorRepository } from "../../../infrastructure/composer";
import { FetchAllMentorsUseCase } from "./fetchAllMentors";

export const fetchAllMentorsUsecase = new FetchAllMentorsUseCase(mentorRepository);

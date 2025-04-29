import { mentorRepository, sessionRepository } from "../../../infrastructure/composer";
import { FetchUpcomingSessionMentorUsecase } from "./fetch.upcoming.sessons.usecase";
import { FetchAllApprovedMentorsUsecase } from "./fetchAllApprovedMentors.usecase";
import { FetchAllMentorsUseCase } from "./fetchAllMentors.usecase";
import { FetchMentorUsecase } from "./fetchMentor.usecase";
import { FetchSessionRequests } from "./fetchSessionRequests.usecase";
import { UpdateRequestStatusUsecase } from "./update.request.status.usecase";

export const fetchAllMentorsUsecase = new FetchAllMentorsUseCase(mentorRepository);
export const fetchAllApprovedMentorsUsecase = new FetchAllApprovedMentorsUsecase(mentorRepository);
export const fetchMentorUsecase = new FetchMentorUsecase(mentorRepository);
export const fetchRequestUsecase = new FetchSessionRequests(sessionRepository);
export const updateRequestStatusUsecase = new UpdateRequestStatusUsecase(sessionRepository);
export const fetchUpcomingSessionMentorUsecase = new FetchUpcomingSessionMentorUsecase(sessionRepository);

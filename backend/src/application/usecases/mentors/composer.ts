import { mentorRepository, sessionRepository } from "../../../infrastructure/composer";
import { GetAvailabilityUseCase } from "./get.mentor.availability.usecase";
import { GetSessionHistoryUsecase } from "./get.session.history.usecase";
import { GetUpcomingSessionMentorUsecase } from "./get.upcoming.sessions.usecase";
import { GetAllApprovedMentorsUsecase } from "./getAllApprovedMentors.usecase";
import { GetAllMentorsUseCase } from "./getAllMentors.usecase";
import { GetMentorUsecase } from "./getMentor.usecase";
import { GetSessionRequests } from "./getSessionRequests.usecase";
import { UpdateRequestStatusUsecase } from "./update.request.status.usecase";

export const getAllMentorsUsecase = new GetAllMentorsUseCase(mentorRepository);
export const getAllApprovedMentorsUsecase = new GetAllApprovedMentorsUsecase(mentorRepository);
export const getMentorUsecase = new GetMentorUsecase(mentorRepository);
export const getRequestUsecase = new GetSessionRequests(sessionRepository);
export const updateRequestStatusUsecase = new UpdateRequestStatusUsecase(sessionRepository);
export const getUpcomingSessionMentorUsecase = new GetUpcomingSessionMentorUsecase(sessionRepository);
export const getSessionHistoryUsecase = new GetSessionHistoryUsecase(sessionRepository);
export const getAvailabilityUsecase = new GetAvailabilityUseCase(mentorRepository, sessionRepository)
import { mentorRepository, sessionRepository, userRepository } from "../../../infrastructure/composer";
import { updateUserTaskProgressUseCase } from "../gamification/composer";
import { GetAvailabilityUseCase } from "./get.mentor.availability.usecase";
import { GetSessionHistoryUsecase } from "./get.session.history.usecase";
import { GetUpcomingSessionMentorUsecase } from "./get.upcoming.sessions.usecase";
import { GetAllApprovedMentorsUsecase } from "./getAllApprovedMentors.usecase";
import { GetAllMentorsUseCase } from "./getAllMentors.usecase";
import { GetMentorUsecase } from "./getMentor.usecase";
import { GetSessionRequests } from "./getSessionRequests.usecase";
import { UpdateSessionStatusUsecase } from "./update.status.usecase";

export const getAllMentorsUsecase = new GetAllMentorsUseCase(mentorRepository);
export const getAllApprovedMentorsUsecase = new GetAllApprovedMentorsUsecase(mentorRepository);
export const getMentorUsecase = new GetMentorUsecase(mentorRepository);
export const getRequestUsecase = new GetSessionRequests(sessionRepository);
export const updateSessionStatusUsecase = new UpdateSessionStatusUsecase(sessionRepository, updateUserTaskProgressUseCase, userRepository);
export const getUpcomingSessionMentorUsecase = new GetUpcomingSessionMentorUsecase(sessionRepository);
export const getSessionHistoryUsecase = new GetSessionHistoryUsecase(sessionRepository);
export const getAvailabilityUsecase = new GetAvailabilityUseCase(mentorRepository, sessionRepository);
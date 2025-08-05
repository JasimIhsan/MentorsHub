import { cloudinaryService, mentorRepository, s3BucketService, sessionRepository, specialAvailabilityRepository, userRepository, weeklyAvailabilityRepository } from "../../../infrastructure/composer";
import { UploadMentorDocumentUseCase } from "../documents/upload.mentor.document.usecase";
import { updateUserTaskProgressUseCase } from "../gamification/composer";
import { notifyUserUseCase } from "../notification/composer";
import { GetAvailabilityUseCase } from "./get.mentor.availability.usecase";
import { GetSessionHistoryUsecase } from "./get.session.history.usecase";
import { GetUpcomingSessionMentorUsecase } from "./get.upcoming.sessions.usecase";
import { GetAllApprovedMentorsUsecase } from "./getAllApprovedMentors.usecase";
import { GetAllMentorsUseCase } from "./getAllMentors.usecase";
import { GetMentorUsecase } from "./getMentor.usecase";
import { GetSessionRequests } from "./getSessionRequests.usecase";
import { UpdateMentorProfileUseCase } from "./update.mentor.profile.usecase";
import { UpdateSessionStatusUsecase } from "./update.status.usecase";

const uploadMentorDocumentUseCase = new UploadMentorDocumentUseCase(s3BucketService);

export const getAllMentorsUsecase = new GetAllMentorsUseCase(mentorRepository);
export const getAllApprovedMentorsUsecase = new GetAllApprovedMentorsUsecase(mentorRepository);
export const getMentorUsecase = new GetMentorUsecase(mentorRepository);
export const getRequestUsecase = new GetSessionRequests(sessionRepository);
export const getUpcomingSessionMentorUsecase = new GetUpcomingSessionMentorUsecase(sessionRepository);
export const getSessionHistoryUsecase = new GetSessionHistoryUsecase(sessionRepository);
export const getAvailabilityUsecase = new GetAvailabilityUseCase(sessionRepository, weeklyAvailabilityRepository, specialAvailabilityRepository);
export const updateMentorProfileUseCase = new UpdateMentorProfileUseCase(mentorRepository, userRepository, uploadMentorDocumentUseCase, notifyUserUseCase, cloudinaryService);
export const updateSessionStatusUsecase = new UpdateSessionStatusUsecase(sessionRepository, updateUserTaskProgressUseCase, userRepository, notifyUserUseCase, getAvailabilityUsecase);

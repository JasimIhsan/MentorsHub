import {
	getAllApprovedMentorsUsecase,
	getAllMentorsUsecase,
	getMentorUsecase,
	getRequestUsecase,
	getSessionHistoryUsecase,
	getUpcomingSessionMentorUsecase,
	updateMentorProfileUseCase,
	updateSessionStatusUsecase,
} from "../../../application/usecases/mentors/composer";
import { GetAllApprovedMentorsController } from "./get.all.approved.mentors.controller";
import { GetAllMentorsController } from "./get.all.mentors.controller";
import { GetSessionRequestsController } from "./get.requests.controller";
import { GetMentorController } from "./get.mentor.controller";
import { UpdateSessionStatusController } from "./update.session.status.controller";
import { GetUpcomingSessionMentorController } from "./get.upcoming.session.mentors.controller";
import { GetSessionHistoryController } from "./get.session.history.controller";
import { UpdateMentorProfileController } from "./update.mentor.profile.controller";

export const getAllMentorsController = new GetAllMentorsController(getAllMentorsUsecase);
export const getAllApprovedMentorsController = new GetAllApprovedMentorsController(getAllApprovedMentorsUsecase);
export const getMentorController = new GetMentorController(getMentorUsecase);
export const getSessionsRequestsController = new GetSessionRequestsController(getRequestUsecase);
export const updateSessionStatusController = new UpdateSessionStatusController(updateSessionStatusUsecase);
export const getUpcomingSessionMentorController = new GetUpcomingSessionMentorController(getUpcomingSessionMentorUsecase);
export const getSessionHistoryController = new GetSessionHistoryController(getSessionHistoryUsecase);
export const updateMentorProfileController = new UpdateMentorProfileController(updateMentorProfileUseCase);

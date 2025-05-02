import {
	getAllApprovedMentorsUsecase,
	getAllMentorsUsecase,
	getMentorUsecase,
	getRequestUsecase,
	getSessionHistoryUsecase,
	getUpcomingSessionMentorUsecase,
	updateRequestStatusUsecase,
} from "../../../application/usecases/mentors/composer";
import { GetAllApprovedMentorsController } from "./get.all.approved.mentors.controller";
import { GetAllMentorsController } from "./get.all.mentors.controller";
import { GetRequestsController } from "./get.requests.controller";
import { GetMentorController } from "./get.mentor.controller";
import { UpdateRequestStatusController } from "./update.request.status.controller";
import { GetUpcomingSessionMentorController } from "./get.upcoming.session.mentors.controller";
import { GetSessionHistoryController } from "./get.session.history.controller";

export const getAllMentorsController = new GetAllMentorsController(getAllMentorsUsecase);
export const getAllApprovedMentorsController = new GetAllApprovedMentorsController(getAllApprovedMentorsUsecase);
export const getMentorController = new GetMentorController(getMentorUsecase);
export const getSessionsRequestsController = new GetRequestsController(getRequestUsecase);
export const updateRequestStatusController = new UpdateRequestStatusController(updateRequestStatusUsecase);
export const getUpcomingSessionMentorController = new GetUpcomingSessionMentorController(getUpcomingSessionMentorUsecase);
export const getSessionHistoryController = new GetSessionHistoryController(getSessionHistoryUsecase);

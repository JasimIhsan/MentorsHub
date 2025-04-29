import {
	fetchAllApprovedMentorsUsecase,
	fetchAllMentorsUsecase,
	fetchMentorUsecase,
	fetchRequestUsecase,
	fetchSessionHistoryUsecase,
	fetchUpcomingSessionMentorUsecase,
	updateRequestStatusUsecase,
} from "../../../application/usecases/mentors/composer";
import { FetchAllApprovedMentorsController } from "./fetch.all.approved.mentors.controller";
import { FetchAllMentorsController } from "./fetch.all.mentors.controller";
import { FetchRequestsController } from "./fetch.requests.controller";
import { FetchMentorController } from "./fetch.mentor.controller";
import { UpdateRequestStatusController } from "./update.request.status.controller";
import { FetchUpcomingSessionMentorController } from "./fetch.session.mentors.controller";
import { FetchSessionHistoryController } from "./fetch.session.history.controller";

export const fetchAllMentorsController = new FetchAllMentorsController(fetchAllMentorsUsecase);
export const fetchAllApprovedMentorsController = new FetchAllApprovedMentorsController(fetchAllApprovedMentorsUsecase);
export const fetchMentorController = new FetchMentorController(fetchMentorUsecase);
export const fetchSessionsRequestsController = new FetchRequestsController(fetchRequestUsecase);
export const updateRequestStatusController = new UpdateRequestStatusController(updateRequestStatusUsecase);
export const fetchUpcomingSessionMentorController = new FetchUpcomingSessionMentorController(fetchUpcomingSessionMentorUsecase);
export const fetchSessionHistoryController = new FetchSessionHistoryController(fetchSessionHistoryUsecase);

import { fetchAllApprovedMentorsUsecase, fetchAllMentorsUsecase, fetchMentorUsecase, fetchRequestUsecase } from "../../../application/usecases/mentors/composer";
import { FetchAllApprovedMentorsController } from "./fetch.all.approved.mentors.controller";
import { FetchAllMentorsController } from "./fetch.all.mentors.controller";
import { FetchRequestsController } from "./fetch.requests.controller";
import { FetchMentorController } from "./fetch.mentor.controller";

export const fetchAllMentorsController = new FetchAllMentorsController(fetchAllMentorsUsecase);
export const fetchAllApprovedMentorsController = new FetchAllApprovedMentorsController(fetchAllApprovedMentorsUsecase);
export const fetchMentorController = new FetchMentorController(fetchMentorUsecase);
export const fetchSessionsRequestsController = new FetchRequestsController(fetchRequestUsecase)
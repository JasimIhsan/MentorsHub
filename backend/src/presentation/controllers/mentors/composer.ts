import { fetchAllMentorsUsecase } from "../../../application/usecases/mentors/composer";
import { FetchAllApprovedMentorsController } from "./fetch.all.approved.mentors.controller";
import { FetchAllMentorsController } from "./fetch.all.mentors.controller";

export const fetchAllMentorsController = new FetchAllMentorsController(fetchAllMentorsUsecase);

export const fetchAllApprovedMentorsController = new FetchAllApprovedMentorsController(fetchAllMentorsUsecase);
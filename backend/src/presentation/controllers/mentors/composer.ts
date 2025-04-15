import { fetchAllMentorsUsecase } from "../../../application/usecases/mentors/composer";
import { FetchAllMentorsController } from "./fetch.all.mentors.controller";

export const fetchAllMentorsController = new FetchAllMentorsController(fetchAllMentorsUsecase);
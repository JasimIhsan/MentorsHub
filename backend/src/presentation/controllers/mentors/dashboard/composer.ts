import { getMentorStatsUseCase } from "../../../../application/usecases/mentors/dashboard/composer";
import { GetMentorStatsController } from "./get.mentor.stats.controller";

export const getMentorStatsController = new GetMentorStatsController(getMentorStatsUseCase);

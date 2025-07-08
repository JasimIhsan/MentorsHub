import { getMentorStatsUseCase, getMentorWeeklyPerformanceUseCase } from "../../../../application/usecases/mentors/dashboard/composer";
import { GetMentorStatsController } from "./get.mentor.stats.controller";
import { GetMentorWeeklyPerformanceController } from "./get.mentor.weeking.perfomance.controller";

export const getMentorStatsController = new GetMentorStatsController(getMentorStatsUseCase);
export const getMentorWeeklyPerformanceController = new GetMentorWeeklyPerformanceController(getMentorWeeklyPerformanceUseCase);
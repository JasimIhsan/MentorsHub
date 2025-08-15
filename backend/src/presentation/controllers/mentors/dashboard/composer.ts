import { getMentorStatsUseCase, getMentorWeeklyPerformanceUseCase, getMentorWeeklyRatingsUseCase } from "../../../../application/usecases/mentors/dashboard/composer";
import { GetMentorStatsController } from "./get.mentor.stats.controller";
import { GetMentorWeeklyPerformanceController } from "./get.mentor.weeking.perfomance.controller";
import { GetMentorWeeklyRatingsController } from "./get.mentor.weekly.rating.controller";

export const getMentorStatsController = new GetMentorStatsController(getMentorStatsUseCase);
export const getMentorWeeklyPerformanceController = new GetMentorWeeklyPerformanceController(getMentorWeeklyPerformanceUseCase);
export const getMentorWeeklyRatingsController = new GetMentorWeeklyRatingsController(getMentorWeeklyRatingsUseCase);
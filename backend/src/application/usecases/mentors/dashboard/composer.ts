import { reviewRepository, sessionRepository } from "../../../../infrastructure/composer";
import { GetMentorStatsUseCase } from "./get.mentor.stats.usecase";
import { GetMentorWeeklyPerformanceUseCase } from "./get.metnor.weekly.perfomance.usecase";

export const getMentorStatsUseCase = new GetMentorStatsUseCase(sessionRepository, reviewRepository);
export const getMentorWeeklyPerformanceUseCase = new GetMentorWeeklyPerformanceUseCase(sessionRepository);

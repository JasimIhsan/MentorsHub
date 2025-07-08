import { reviewRepository, sessionRepository } from "../../../../infrastructure/composer";
import { GetMentorStatsUseCase } from "./get.mentor.stats.usecase";

export const getMentorStatsUseCase = new GetMentorStatsUseCase(sessionRepository, reviewRepository);

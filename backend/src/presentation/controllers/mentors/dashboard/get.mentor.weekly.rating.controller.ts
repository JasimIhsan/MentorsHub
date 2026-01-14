import { NextFunction, Request, Response } from "express";
import { IGetMentorWeeklyRatingsUseCase } from "../../../../application/interfaces/usecases/mentors/mentor.dashboard.interface";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetMentorWeeklyRatingsController {
   constructor(private readonly getMentorWeeklyRatingsUseCase: IGetMentorWeeklyRatingsUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const period = req.query.period;
         const rating = await this.getMentorWeeklyRatingsUseCase.execute(mentorId, period as "all" | "month" | "sixMonths" | "year");
         res.status(HttpStatusCode.OK).json({ success: true, weeklyRatings: rating });
      } catch (error) {
         logger.error(`❌ Error in GetMentorWeeklyRatingsController: ${error}`);
         next(error);
      }
   }
}

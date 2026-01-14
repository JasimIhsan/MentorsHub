import { NextFunction, Request, Response } from "express";
import { SessionStatusEnum } from "../../../application/interfaces/enums/session.status.enums";
import { IGetUpcomingSessionMentorUsecase } from "../../../application/interfaces/usecases/mentors/mentors.interface";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetUpcomingSessionMentorController {
   constructor(private getUpcomingSessionMentorUsecase: IGetUpcomingSessionMentorUsecase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const { status, filterOption, page = "1", limit = "6" } = req.query;

         const queryParams = {
            status: status as SessionStatusEnum | undefined,
            filterOption: filterOption as "today" | "week" | "all" | "month",
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
         };

         const sessions = await this.getUpcomingSessionMentorUsecase.execute(mentorId, queryParams);

         res.status(HttpStatusCode.OK).json({ success: true, sessions: sessions.sessions, total: sessions.total });
      } catch (error) {
         logger.error(`❌ Error in GetUpcomingSessionMentorController: ${error}`);
         next(error);
      }
   }
}

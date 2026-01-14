import { NextFunction, Request, Response } from "express";
import { SessionStatusEnum } from "../../../application/interfaces/enums/session.status.enums";
import { IGetSessionHistoryUsecase } from "../../../application/interfaces/usecases/mentors/mentors.interface";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetSessionHistoryController {
   constructor(private getSessionHistoryUsecase: IGetSessionHistoryUsecase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const { status, page = "1", limit = "6" } = req.query;
         const queryParams = {
            status: status as SessionStatusEnum,
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
         };
         const sessions = await this.getSessionHistoryUsecase.execute(mentorId, queryParams);
         res.status(HttpStatusCode.OK).json({ success: true, sessions: sessions.sessions, total: sessions.total });
      } catch (error) {
         logger.error(`❌ Error in GetSessionHistoryController: ${error}`);
         next(error);
      }
   }
}

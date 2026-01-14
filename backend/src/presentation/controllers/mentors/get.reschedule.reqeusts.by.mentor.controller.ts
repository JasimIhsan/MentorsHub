import { NextFunction, Request, Response } from "express";
import { RescheduleStatusEnum } from "../../../application/interfaces/enums/reschedule.status.enum";
import { IGetSessionRescheduleRequestsByMentorUseCase } from "../../../application/interfaces/usecases/reschedule.request";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetRescheduleRequestsByMentorController {
   constructor(private readonly getSessionRescheduleRequestsByMentorUseCase: IGetSessionRescheduleRequestsByMentorUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const { page, limit, status } = req.query;

         const requests = await this.getSessionRescheduleRequestsByMentorUseCase.execute(mentorId, {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            status: status as RescheduleStatusEnum,
         });
         res.status(HttpStatusCode.OK).json({ success: true, requests: requests.sessions, total: requests.total });
      } catch (error) {
         console.error(`❌❌❌ Error in GetRescheduleRequestsByMentorController: ${error}`);
         logger.error(`❌ Error in GetRescheduleRequestsByMentorController: ${error}`);
         next(error);
      }
   }
}

import { NextFunction, Request, Response } from "express";
import { ICounterRescheduleRequestUseCase } from "../../../application/interfaces/usecases/reschedule.request";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class CouterRescheduleRequestController {
   constructor(private readonly counterRescheduleRequestUseCase: ICounterRescheduleRequestUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const { startTime, endTime, message, date } = req.body;

         const request = await this.counterRescheduleRequestUseCase.execute(userId, sessionId, startTime, endTime, message, new Date(date));

         res.status(HttpStatusCode.OK).json({ success: true, request, message: "Request sent successfully" });
      } catch (error) {
         logger.error(`❌ Error in CouterRescheduleRequestController: ${error}`);
         next(error);
      }
   }
}

import { NextFunction, Request, Response } from "express";
import { IAcceptRescheduleRequestUseCase } from "../../../application/interfaces/usecases/reschedule.request";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class AcceptRescheduleRequestController {
   constructor(private readonly acceptRescheduleRequestUseCase: IAcceptRescheduleRequestUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const { isCounter } = req.body;
         const session = await this.acceptRescheduleRequestUseCase.execute(userId, sessionId, isCounter);

         res.status(HttpStatusCode.OK).json({ success: true, session, message: "Request accepted successfully" });
      } catch (error) {
         logger.error(`❌ Error in AcceptRescheduleRequestController: ${error}`);
         next(error);
      }
   }
}

import { NextFunction, Request, Response } from "express";
import { ICancelSessionByMentorUseCase } from "../../../application/interfaces/usecases/session";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class CancelSessionByMentorController {
   constructor(private readonly cancelSessionByMentorUseCase: ICancelSessionByMentorUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

         const session = await this.cancelSessionByMentorUseCase.execute(sessionId, userId);
         res.status(HttpStatusCode.OK).json({ success: true, session, message: "Session cancelled successfully" });
      } catch (error) {
         logger.error(`❌ Error in CancelSessionByMentorController: ${error}`);
         next(error);
      }
   }
}

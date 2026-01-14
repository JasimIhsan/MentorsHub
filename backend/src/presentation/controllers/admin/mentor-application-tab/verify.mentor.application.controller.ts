import { NextFunction, Request, Response } from "express";
import { IVerifyMentorApplicationUsecase } from "../../../../application/interfaces/usecases/admin/admin.mentor.application.interface";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class VerifyMentorApplicationController {
   constructor(private verifyMentorApplicationUsecase: IVerifyMentorApplicationUsecase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const { mentorRequestStatus, rejectionReason } = req.body;

         const user = await this.verifyMentorApplicationUsecase.execute(userId, mentorRequestStatus, rejectionReason);
         res.status(HttpStatusCode.OK).json({ success: true, user });
      } catch (error) {
         logger.error(`❌ Error in VerifyMentorApplicationController: ${error}`);
         next(error);
      }
   }
}

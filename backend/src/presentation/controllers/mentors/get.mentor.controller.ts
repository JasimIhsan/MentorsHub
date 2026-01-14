import { NextFunction, Request, Response } from "express";
import { IGetMentorUsecase } from "../../../application/interfaces/usecases/mentors/mentors.interface";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetMentorController {
   constructor(private getMentorUsecase: IGetMentorUsecase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const mentor = await this.getMentorUsecase.execute(userId);
         res.status(HttpStatusCode.OK).json({ success: true, mentor });
      } catch (error) {
         logger.error(`❌ Error in GetMentorController: ${error}`);
         next(error);
      }
   }
}

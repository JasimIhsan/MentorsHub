import { NextFunction, Request, Response } from "express";
import { IDeleteWeeklySlotUsecase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class DeleteWeeklySlotController {
   constructor(private readonly deleteWeeklySlotUseCase: IDeleteWeeklySlotUsecase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const slotId = Array.isArray(req.params.slotId) ? req.params.slotId[0] : req.params.slotId;
         await this.deleteWeeklySlotUseCase.execute(slotId, mentorId);
         res.status(HttpStatusCode.OK).json({ success: true });
      } catch (error) {
         logger.error(`❌ Error in DeleteWeeklySlotController: ${error}`);
         next(error);
      }
   }
}

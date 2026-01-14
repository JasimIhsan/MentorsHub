import { NextFunction, Request, Response } from "express";
import { IDeleteSpecialSlotUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class DeleteSpecialSlotController {
   constructor(private readonly deleteSpecialSlotUseCase: IDeleteSpecialSlotUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const slotId = Array.isArray(req.params.slotId) ? req.params.slotId[0] : req.params.slotId;
         await this.deleteSpecialSlotUseCase.execute(slotId, mentorId);
         res.status(HttpStatusCode.OK).json({ success: true, message: "Slot deleted successfully" });
      } catch (error) {
         logger.error(`❌ Error in DeleteSpecialSlotController: ${error}`);
         next(error);
      }
   }
}

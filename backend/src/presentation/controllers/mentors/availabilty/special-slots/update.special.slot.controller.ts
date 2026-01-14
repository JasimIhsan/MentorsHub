import { NextFunction, Request, Response } from "express";
import { IUpdateSpecialSlotUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class UpdateSpecialSlotController {
   constructor(private readonly updateSpecialSlotUseCase: IUpdateSpecialSlotUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const slotId = Array.isArray(req.params.slotId) ? req.params.slotId[0] : req.params.slotId;
         const { startTime, endTime } = req.body;

         await this.updateSpecialSlotUseCase.execute(slotId, mentorId, startTime, endTime);

         res.status(HttpStatusCode.OK).json({ success: true, message: "Slot updated successfully" });
      } catch (error) {
         logger.error(`❌ Error in UpdateSpecialSlotController: ${error}`);
         next(error);
      }
   }
}

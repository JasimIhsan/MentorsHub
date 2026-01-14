import { NextFunction, Request, Response } from "express";
import { IAddSpecialSlotUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class AddSpecialSlotController {
   constructor(private readonly addSpecialSlotUseCase: IAddSpecialSlotUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const { startTime, endTime, date } = req.body;
         const slot = await this.addSpecialSlotUseCase.execute(mentorId, new Date(date), startTime, endTime);
         res.status(HttpStatusCode.OK).json({ success: true, slot, message: "Slot added successfully" });
      } catch (error) {
         logger.error(`❌ Error in AddSpecialSlotController: ${error}`);
         next(error);
      }
   }
}

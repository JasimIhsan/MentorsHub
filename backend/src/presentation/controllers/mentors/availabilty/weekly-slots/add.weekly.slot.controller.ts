import { NextFunction, Request, Response } from "express";
import { IAddSlotAvailabilityToWeekUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class AddWeeklySlotController {
   constructor(private readonly addSlotAvailabilityToWeekUseCase: IAddSlotAvailabilityToWeekUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const { day, startTime, endTime } = req.body;
         const slot = await this.addSlotAvailabilityToWeekUseCase.execute(mentorId, parseInt(day), startTime, endTime);
         res.status(HttpStatusCode.OK).json({ success: true, slot });
      } catch (error) {
         logger.error(`❌ Error in AddWeeklySlotController: ${error}`);
         next(error);
      }
   }
}

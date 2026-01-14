import { NextFunction, Request, Response } from "express";
import { IGetAllWeeklyAvailabilityUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class GetAllWeeklyAvailabilityController {
   constructor(private readonly getAllWeeklyAvailabilityUseCase: IGetAllWeeklyAvailabilityUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const slots = await this.getAllWeeklyAvailabilityUseCase.execute(mentorId);
         res.status(HttpStatusCode.OK).json({ success: true, slots });
      } catch (error) {
         logger.error(`❌ Error in GetAllWeeklyAvailabilityController: ${error}`);
         next(error);
      }
   }
}

import { NextFunction, Request, Response } from "express";
import { IGetSpecialSlotByMentorUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class GetSpecialSlotByMentorController {
   constructor(private readonly getSpecialSlotByMentorUseCase: IGetSpecialSlotByMentorUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const slots = await this.getSpecialSlotByMentorUseCase.execute(mentorId);
         res.status(HttpStatusCode.OK).json({ success: true, slots });
      } catch (error) {
         logger.error(`❌ Error in GetSpecialSlotByMentorController: ${error}`);
         next(error);
      }
   }
}

import { NextFunction, Request, Response } from "express";
import { IGetMentorAvailabilityToUserUseCase } from "../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetMentorAvailabilityToUserController {
   constructor(private readonly getMentorAvailabilityToUserUseCase: IGetMentorAvailabilityToUserUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = Array.isArray(req.params.mentorId) ? req.params.mentorId[0] : req.params.mentorId;
         const availability = await this.getMentorAvailabilityToUserUseCase.execute(mentorId);
         res.status(HttpStatusCode.OK).json({ success: true, availability });
      } catch (error) {
         next(error);
      }
   }
}

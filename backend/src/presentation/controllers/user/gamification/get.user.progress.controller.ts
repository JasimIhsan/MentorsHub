import { NextFunction, Request, Response } from "express";
import { IGetUserProgressUseCase } from "../../../../application/interfaces/usecases/gamification";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetUserProgressController {
   constructor(private readonly getUserProgressUseCase: IGetUserProgressUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const progress = await this.getUserProgressUseCase.execute(userId);
         res.status(HttpStatusCode.OK).json({ success: true, progress });
      } catch (error) {
         logger.error(`❌ Error in GetUserProgressController: ${error}`);
         next(error);
      }
   }
}

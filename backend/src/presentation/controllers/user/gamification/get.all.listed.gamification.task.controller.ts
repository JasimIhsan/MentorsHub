import { NextFunction, Request, Response } from "express";
import { IGetAllListedGamificationTasksUseCase } from "../../../../application/interfaces/usecases/gamification";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetAllListedGamificationTasksController {
   constructor(private readonly getAllListedGamificationTasksUseCase: IGetAllListedGamificationTasksUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const { page, limit, searchTerm } = req.query;
         const { tasks, totalCount } = await this.getAllListedGamificationTasksUseCase.execute(userId, { page: page ? parseInt(page as string, 10) : 1, limit: limit ? parseInt(limit as string, 10) : 10, searchTerm: searchTerm as string });

         res.status(HttpStatusCode.OK).json({ success: true, tasks, totalCount });
      } catch (error) {
         logger.error(`❌ Error in GetAllListedGamificationTasksController: ${error}`);
         next(error);
      }
   }
}

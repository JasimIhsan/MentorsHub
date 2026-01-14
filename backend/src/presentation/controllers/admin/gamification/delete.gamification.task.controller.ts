import { NextFunction, Request, Response } from "express";
import { IDeleteGamificationTaskUseCase } from "../../../../application/interfaces/usecases/gamification";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class DeleteGamificationTaskController {
   constructor(private readonly deleteGamificationTaskUseCase: IDeleteGamificationTaskUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
         await this.deleteGamificationTaskUseCase.execute(taskId);
         res.status(HttpStatusCode.OK).json({ success: true, message: "Task deleted successfully" });
      } catch (error) {
         logger.error("❌ Error in DeleteGamificationTaskController: ", error);
         next(error);
      }
   }
}

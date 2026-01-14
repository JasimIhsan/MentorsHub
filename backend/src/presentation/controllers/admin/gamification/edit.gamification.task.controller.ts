import { NextFunction, Request, Response } from "express";
import { IEditGamificationTaskUseCase } from "../../../../application/interfaces/usecases/gamification";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class EditGamificationTaskController {
   constructor(private readonly editGamificationTaskUseCase: IEditGamificationTaskUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
         const { title, xpReward, targetCount, actionType } = req.body;
         const task = await this.editGamificationTaskUseCase.execute({ taskId, title, xpReward, targetCount, actionType });
         res.status(HttpStatusCode.OK).json({ success: true, message: "Task updated successfully", task });
      } catch (error) {
         logger.error("❌ Error in EditGamificationTaskController: ", error);
         next(error);
      }
   }
}

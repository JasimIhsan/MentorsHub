import { NextFunction, Request, Response } from "express";
import { IEditGamificationTaskUseCase } from "../../../../application/interfaces/gamification";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class EditGamificationTaskController {
	constructor(private useCase: IEditGamificationTaskUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { taskId } = req.params;
			const { title, xpReward, targetCount, actionType } = req.body;
			const task = await this.useCase.execute({ taskId, title, xpReward, targetCount, actionType });
			res.status(HttpStatusCode.OK).json({ success: true, message: "Task updated successfully", task });
		} catch (error) {
			logger.error("❌ Error in EditGamificationTaskController: ", error);
			next(error);
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { IUpdateGamificationTaskStatusUseCase } from "../../../../application/interfaces/usecases/gamification";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class UpdateGamificationTaskStatusController {
	constructor(private readonly updateGamificationTaskStatusUseCase: IUpdateGamificationTaskStatusUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { taskId } = req.params;
			const { status } = req.body;
			const task = await this.updateGamificationTaskStatusUseCase.execute(taskId, status);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Task status updated successfully", task });
		} catch (error) {
			logger.error("❌ Error in UpdateGamificationTaskController: ", error);
			next(error);
		}
	}
}

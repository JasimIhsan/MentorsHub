import { NextFunction, Request, Response } from "express";
import { IDeleteGamificationTaskUseCase } from "../../../../application/interfaces/gamification";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class DeleteGamificationTaskController {
	constructor(private useCase: IDeleteGamificationTaskUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { taskId } = req.params;
			await this.useCase.execute(taskId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Task deleted successfully" });
		} catch (error) {
			logger.error("❌ Error in DeleteGamificationTaskController: ", error);
			next(error);
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { ICreateGamificationTaskUseCase } from "../../../../application/interfaces/gamification";
import { logger } from "../../../../infrastructure/utils/logger";

export class CreateGamificationTaskController {
	constructor(private useCase: ICreateGamificationTaskUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { title, xpReward, targetCount, actionType } = req.body;

			const task = await this.useCase.execute({ title, xpReward, targetCount, actionType });

			res.status(200).json({ success: true, message: "Task created successfully", task });
		} catch (error) {
			logger.error(`❌ Error in CreateGamificationTaskController: ${error}`);
			next(error);
		}
	}
}

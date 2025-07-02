import { NextFunction, Request, Response } from "express";
import { IGetAllGamificationTasksUseCase } from "../../../../application/interfaces/gamification";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetAllGamificationTasksController {
	constructor(private useCase: IGetAllGamificationTasksUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit, actionType , searchTerm } = req.query;

			const tasks = await this.useCase.execute({
				page: page ? parseInt(page as string, 10) : 1,
				limit: limit ? parseInt(limit as string, 10) : 10,
				actionType: actionType as string,
				searchTerm: searchTerm as string,
			});

			res.status(HttpStatusCode.OK).json({ success: true, tasks });
		} catch (error) {
			logger.error(`❌ Error in GetAllGamificationTasksController: ${error}`);
			next(error);
		}
	}
}

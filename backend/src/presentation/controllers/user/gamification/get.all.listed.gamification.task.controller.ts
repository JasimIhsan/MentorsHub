import { NextFunction, Request, Response } from "express";
import { IGetAllListedGamificationTasksUseCase } from "../../../../application/interfaces/gamification";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetAllListedGamificationTasksController {
	constructor(private useCase: IGetAllListedGamificationTasksUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;
			const { page, limit, searchTerm } = req.query;
			const { tasks, totalCount } = await this.useCase.execute(userId, { page: page ? parseInt(page as string, 10) : 1, limit: limit ? parseInt(limit as string, 10) : 10, searchTerm: searchTerm as string });

			res.status(HttpStatusCode.OK).json({ success: true, tasks , totalCount });
		} catch (error) {
			logger.error(`❌ Error in GetAllListedGamificationTasksController: ${error}`);
			next(error);
		}
	}
}

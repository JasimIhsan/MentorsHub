import { Request, Response, NextFunction } from "express";
import { IGetUserProgressUseCase } from "../../../../application/interfaces/usecases/gamification";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetUserProgressController {
	constructor(private useCase: IGetUserProgressUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.userId;
			const progress = await this.useCase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, progress });
		} catch (error) {
			logger.error(`❌ Error in GetUserProgressController: ${error}`);
			next(error);
		}
	}
}

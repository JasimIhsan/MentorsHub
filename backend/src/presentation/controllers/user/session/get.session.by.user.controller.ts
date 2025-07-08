import { NextFunction, Request, Response } from "express";
import { IGetSessionsByUserUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetSessionByUserController {
	constructor(private getSessionByUserUsecase: IGetSessionsByUserUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.userId;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const search = (req.query.search as string) || "";
			const status = (req.query.status as string) || ""; // "completed", "upcoming", etc.

			// Use case call with filters
			const {sessions, total} = await this.getSessionByUserUsecase.execute(userId, {
				page,
				limit,
				search,
				status,
			});

			res.status(HttpStatusCode.OK).json({
				success: true,
				sessions,
				total,
			});
		} catch (error) {
			logger.error(`❌ Error in GetSessionByUserController: ${error}`);
			next(error);
		}
	}
}

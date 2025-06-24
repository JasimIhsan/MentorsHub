import { NextFunction, Request, Response } from "express";
import { IGetSessionsByUserUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetSessionByUserController {
	constructor(private getSessionByUserUsecase: IGetSessionsByUserUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.userId;
			const sessions = await this.getSessionByUserUsecase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, sessions });
		} catch (error: any) {
			logger.error(`❌ Error in GetSessionByUserController: ${error.message}`);
			next(error);
		}
	}
}

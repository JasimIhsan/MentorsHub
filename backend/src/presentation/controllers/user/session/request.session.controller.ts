import { NextFunction, Request, Response } from "express";
import { IRequestSessionUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class RequestSessionController {
	constructor(private requestSessionUsecase: IRequestSessionUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const requestData = req.body;
			console.log(`request data date in controller : `, requestData.date);

			const session = await this.requestSessionUsecase.execute(requestData);
			res.status(HttpStatusCode.OK).json({ success: true, session, message: "Session requested successfully" });
		} catch (error: any) {
			logger.error(`❌ Error in RequestSessionController: ${error.message}`);
			next(error);
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { IStartSessionUseCase } from "../../../application/interfaces/session";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class StartSessionController {
	constructor(private startSessionUsecase: IStartSessionUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId } = req.params;
			console.log("sessionId: ", sessionId);
			// await this.startSessionUsecase.execute(sessionId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Session started successfully" });
		} catch (error: any) {
			logger.error(`❌ Error in StartSessionController: ${error.message}`);
			next(error);
		}
	}
}

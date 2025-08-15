// Handles HTTP requests for session operations
import { NextFunction, Request, Response } from "express";
import { ICancelSessionUseCase } from "../../../../application/interfaces/usecases/session";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class CancelSessionController {
	constructor(private cancelSessionUseCase: ICancelSessionUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { sessionId, userId } = req.body;
			if (!sessionId || !userId) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Session ID and User ID are required" });
				return;
			}

			const session = await this.cancelSessionUseCase.execute(sessionId, userId);
			res.status(HttpStatusCode.OK).json({ success: true, session: session });
		} catch (error) {
			logger.error(`❌ Error in CancelSessionController: ${error}`);
			next(error);
		}
	}
}

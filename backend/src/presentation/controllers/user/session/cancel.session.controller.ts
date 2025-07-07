// Handles HTTP requests for session operations
import { NextFunction, Request, Response } from "express";
import { ICancelSessionUseCase } from "../../../../application/interfaces/session";
import { logger } from "../../../../infrastructure/utils/logger";

export class CancelSessionController {
	constructor(private cancelSessionUseCase: ICancelSessionUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { sessionId, userId } = req.body;
			if (!sessionId || !userId) {
				res.status(400).json({ success: false, message: "Session ID and User ID are required" });
				return;
			}

			const session = await this.cancelSessionUseCase.execute(sessionId, userId);
			res.status(200).json({ success: true, session: session });
		} catch (error) {
			logger.error(`❌ Error in CancelSessionController: ${error}`);
			next(error);
		}
	}
}

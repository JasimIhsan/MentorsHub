import { NextFunction, Request, Response } from "express";
import { IPaySessionUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class PaySessionController {
	constructor(private paySessionUsecase: IPaySessionUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId, userId, paymentId, paymentStatus, status } = req.body;
			if (!sessionId || !paymentId || !paymentStatus || !status) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "All fields are required" });
				return;
			}
			await this.paySessionUsecase.execute(sessionId, userId, paymentId, paymentStatus, status);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Session paid successfully" });
		} catch (error: any) {
			logger.error(`❌ Error in PaySessionController: ${error.message}`);
			next(error);
		}
	}
}

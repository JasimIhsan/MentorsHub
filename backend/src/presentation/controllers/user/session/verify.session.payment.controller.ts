import { NextFunction, Request, Response } from "express";
import { IVerifySessionPaymentUseCase } from "../../../../application/interfaces/usecases/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class VerifySessionPaymentController {
	constructor(private verifySessionPaymentUseCase: IVerifySessionPaymentUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId, userId } = req.query;
			const isPaid = await this.verifySessionPaymentUseCase.execute(sessionId as string, userId as string);
			res.status(HttpStatusCode.OK).json({ success: true, isPaid });
		} catch (error) {
			logger.error(error);
			next(error);
		}
	}
}

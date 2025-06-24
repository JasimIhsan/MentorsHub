import { NextFunction, Request, Response } from "express";
import { ICreateSessionPaymentOrderUseCase } from "../../../../application/interfaces/session";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class CreateSessionPaymentOrderController {
	constructor(private createSessionPaymentOrderUseCase: ICreateSessionPaymentOrderUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId, userId } = req.body;
			console.log('userId: ', userId);
			console.log('sessionId: ', sessionId);

			const order = await this.createSessionPaymentOrderUseCase.execute(sessionId, userId);
			res.status(HttpStatusCode.OK).json({ success: true, order });
		} catch (error: any) {
			logger.error(`❌ Error in CreateSessionPaymentOrderController: ${error.message}`);
			next(error);
		}
	}
}

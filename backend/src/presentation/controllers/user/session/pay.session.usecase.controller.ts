import { NextFunction, Request, Response } from "express";
import { IPaySessionWithWalletUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";
import crypto from "crypto";

export class PaySessionWithWalletController {
	constructor(private paySessionWithWalletUseCase: IPaySessionWithWalletUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId, userId, paymentId, paymentStatus, status } = req.body;

			await this.paySessionWithWalletUseCase.execute(sessionId, userId, paymentId, paymentStatus, status);

			res.status(HttpStatusCode.OK).json({
				success: true,
				message: "Session paid successfully with wallet",
			});
		} catch (error) {
			logger.error(`❌ Error in PayWithWalletController: ${error}`);
			next(error);
		}
	}
}

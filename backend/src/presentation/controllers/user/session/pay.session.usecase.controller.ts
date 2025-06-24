import { NextFunction, Request, Response } from "express";
import { IPaySessionUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";
import crypto from "crypto";

export class PaySessionController {
	constructor(private paySessionUsecase: IPaySessionUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { paymentId, orderId, signature, sessionId, paymentStatus, userId, status } = req.body;

			const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET!);
			hmac.update(orderId + "|" + paymentId);
			const digest = hmac.digest("hex");

			if (digest !== signature) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Invalid signature" });
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

import { NextFunction, Request, Response } from "express";
import { IPaySessionWithGatewayUseCase } from "../../../../application/interfaces/usecases/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";
import crypto from "crypto";

export class PaySessionWithGatewayController {
	constructor(private paySessionWithGatewayUseCase: IPaySessionWithGatewayUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { paymentId, orderId, signature, sessionId, paymentStatus, userId, status } = req.body;

			// Verify Razorpay signature
			const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET!);
			hmac.update(orderId + "|" + paymentId);
			const digest = hmac.digest("hex");

			if (digest !== signature) {
				res.status(HttpStatusCode.BAD_REQUEST).json({
					success: false,
					message: "Invalid Razorpay signature",
				});
				return;
			}

			await this.paySessionWithGatewayUseCase.execute(sessionId, userId, paymentId, paymentStatus, status);

			res.status(HttpStatusCode.OK).json({
				success: true,
				message: "Session paid successfully via Razorpay",
			});
		} catch (error) {
			logger.error(`❌ Error in PayWithRazorpayController: ${error}`);
			next(error);
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { ISendOtpUsecase } from "../../../../application/interfaces/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class SendOtpController {
	constructor(private sendOtpUseCase: ISendOtpUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { email } = req.body;

			if (!email) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Email is required" });
				return;
			}
			await this.sendOtpUseCase.execute(email);
			res.status(HttpStatusCode.OK).json({ success: true, message: "OTP sent successfully" });
		} catch (error) {
			logger.error(`❌ Error in SendOtpController: ${error}`);
			next(error);
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { IForgotPasswordUseCase } from "../../../../application/interfaces/usecases/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class ForgotPasswrodController {
	constructor(private forgotUseCase: IForgotPasswordUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { email } = req.body;
			if (!email) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Email is required" });
				return;
			}
			await this.forgotUseCase.execute(email);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Password reset link sent to your email" });
		} catch (error) {
			logger.error(`❌ Error in ForgotPasswrodController: ${error}`);
			next(error);
		}
	}
}

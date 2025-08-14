import { NextFunction, Request, Response } from "express";
import { IResetPasswordUseCase } from "../../../../application/interfaces/usecases/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class ResetPasswordController {
	constructor(private restPasswordUseCase: IResetPasswordUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { token, newPassword } = req.body;
			await this.restPasswordUseCase.execute(token, newPassword);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Password reset successfully" });
		} catch (error) {
			logger.error(`❌ Error in ResetPasswordController: ${error}`);
			next(error);
		}
	}
}

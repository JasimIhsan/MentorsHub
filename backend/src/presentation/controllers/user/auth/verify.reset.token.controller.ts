import { NextFunction, Request, Response } from "express";
import { IVerifyResetTokenUseCase } from "../../../../application/interfaces/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class VerifyResetTokenController {
	constructor(private verifyTokenUseCase: IVerifyResetTokenUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { token } = req.params;
			if (!token) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Token is required" });
				return;
			}
			const isValid = await this.verifyTokenUseCase.execute(token);

			if (isValid) {
				res.status(HttpStatusCode.OK).json({ success: true, message: "Token is valid" });
			} else {
				logger.error("Token is invalid");
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Token is invalid" });
			}
		} catch (error) {
			logger.error(`❌ Error in VerifyResetTokenController: ${error}`);
			next(error);
		}
	}
}

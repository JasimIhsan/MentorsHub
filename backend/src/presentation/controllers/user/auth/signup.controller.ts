import { NextFunction, Request, Response } from "express";
import { ISignupUseCase } from "../../../../application/interfaces/usecases/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class SignupController {
	constructor(private signupUseCase: ISignupUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { otp, signupData } = req.body;

			const { user, refreshToken, accessToken } = await this.signupUseCase.execute(otp, signupData.firstName, signupData.lastName, signupData.email, signupData.password);

			res.cookie("access_token", accessToken, {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
				maxAge: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES as string), // 5 minutes
			});

			res.cookie("refresh_token", refreshToken, {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
				maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES as string), // 24 hours
			});

			res.status(HttpStatusCode.CREATED).json({ success: true, user });
		} catch (error) {
			logger.error(`❌ Error in SignupController: ${error}`);
			next(error);
		}
	}
}

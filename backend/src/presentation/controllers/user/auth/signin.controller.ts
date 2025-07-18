import { NextFunction, Request, Response } from "express";
import { ISignInUseCase } from "../../../../application/interfaces/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class SigninController {
	constructor(private signinUseCase: ISignInUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
			const { user, accessToken, refreshToken } = await this.signinUseCase.execute(email, password);

			const access_token_expires = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES as string);
			const refresh_token_expires = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES as string);

			res.cookie("access_token", accessToken, {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
				maxAge: access_token_expires, // 5 minutes
			});

			res.cookie("refresh_token", refreshToken, {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
				maxAge: refresh_token_expires, // 24 hours
			});

			res.status(HttpStatusCode.OK).json({ success: true, user, accessToken, refreshToken });
	} catch (error) {
			logger.error(`❌ Error in SigninController: ${error}`);
			next(error);
		}
	}
}

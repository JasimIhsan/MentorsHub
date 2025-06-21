import { Request, Response } from "express";
import { ISignInUseCase } from "../../../../application/interfaces/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";

export class SigninController {
	constructor(private signinUseCase: ISignInUseCase) {}

	async handle(req: Request, res: Response) {
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
			if (error instanceof Error) {
				res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: error.message });
				return;
			}
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: CommonStringMessage.SERVER_ERROR_MESSAGE });
		}
	}
}

import { Request, Response } from "express";
import { IGoogleAuthUsecase } from "../../../../application/interfaces/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GoogleAuthController {
	constructor(private googleAuthUsecase: IGoogleAuthUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const { credential } = req.body;

			const { user, accessToken, refreshToken } = await this.googleAuthUsecase.execute(credential);
			if (!user || !accessToken || !refreshToken) {
				res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
				return;
			}

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

			res.status(HttpStatusCode.OK).json({ success: true, user: user });
		} catch (error) {
			if (error instanceof Error) {
				console.log("error from controller: ", error.message);
				res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
				return;
			}
			console.log("An error occurred while google authentication: ", error);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while google authentication" });
			return;
		}
	}
}

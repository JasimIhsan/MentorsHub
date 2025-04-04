import { Request, Response } from "express";
import { IGoogleAuthUsecase } from "../../application/interfaces/auth.usecases";

export class GoogleAuthController {
	constructor(private googleAuthUsecase: IGoogleAuthUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const { credential } = req.body;
			console.log('credentials: ', credential);

			const { user, accessToken, refreshToken } = await this.googleAuthUsecase.execute(credential);
			if (!user || !accessToken || !refreshToken) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}
			res.cookie("access_token", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
			res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
			res.status(200).json({ success: true, user: user });
		} catch (error) {
			if (error instanceof Error) {
				console.log("error from controller: ", error.message);
				res.status(400).json({ message: error.message });
				return;
			}
			console.log("An error occurred while google authentication: ", error);
			res.status(500).json({ message: "An error occurred while google authentication" });
			return;
		}
	}
}

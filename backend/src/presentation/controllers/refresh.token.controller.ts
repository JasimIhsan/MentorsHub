import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../application/usecases/authentication/refresh.token.usecase";

export class RefreshTokenController {
	constructor(private refreshUsecase: RefreshTokenUseCase) {}

	async handle(req: Request, res: Response) {
		const user = req.body;
		const newAccessToken = this.refreshUsecase.execute(user.userId);
		res.clearCookie("access_token");
		res.cookie("access_token", newAccessToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 5 * 1000 });
		res.status(200).json({ success: true, accessToken: newAccessToken, message: "New access token generated" });
	}
}

import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../../../application/usecases/user/authentication/refresh.token.usecase";
import { Payload } from "../../../../application/interfaces/user/token.service.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class RefreshTokenController {
	constructor(private refreshUsecase: RefreshTokenUseCase) {}

	async handle(req: Request, res: Response) {
		const user = req.user as Payload;
		const newAccessToken = this.refreshUsecase.execute(user.userId, user.isAdmin as boolean);
		res.clearCookie("access_token");
		res.cookie("access_token", newAccessToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 5 * 1000 });
		res.status(HttpStatusCode.OK).json({ success: true, accessToken: newAccessToken, message: "New access token generated" });
	}
}

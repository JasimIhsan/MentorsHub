import { NextFunction, Request, Response } from "express";
import { RefreshTokenUseCase } from "../../../../application/usecases/user/authentication/refresh.token.usecase";
import { Payload } from "../../../../application/interfaces/usecases/user/token.service.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";
import { IGetUserProfileUseCase } from "../../../../application/interfaces/usecases/user/user.profile.usecase.interfaces";
import { IGetAdminDetailsUseCase } from "../../../../application/interfaces/usecases/admin/admin.auth.interface";

export class RefreshTokenController {
	constructor(private refreshUsecase: RefreshTokenUseCase, private getUserProfileUsecase: IGetUserProfileUseCase, private getAdminDetailsUsecase: IGetAdminDetailsUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const user = req.user as Payload;
			const newAccessToken = this.refreshUsecase.execute(user.userId, user.isAdmin as boolean);
			res.clearCookie("access_token");

			let userProfile;
			if (!user.isAdmin) {
				userProfile = await this.getUserProfileUsecase.execute(user.userId);
			} else {
				userProfile = await this.getAdminDetailsUsecase.execute(user.userId);
			}

			res.cookie("access_token", newAccessToken, {
				httpOnly: true,
				sameSite: "none",
				secure: true,
				maxAge: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES as string), // 5 minutes
			});

			res.status(HttpStatusCode.OK).json({ success: true, accessToken: newAccessToken, user: userProfile, isAdmin: user.isAdmin, message: "New access token generated" });
		} catch (error) {
			logger.error(`❌ Error in RefreshTokenController: ${error}`);
			next(error);
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { IAdminAuthUsecase } from "../../../../application/interfaces/admin/admin.auth.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { logger } from "../../../../infrastructure/utils/logger";

export class AdminLoginController {
	constructor(private adminLoginUsecase: IAdminAuthUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body;

			const { admin, accessToken, refreshToken } = await this.adminLoginUsecase.execute(username, password);

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

			res.status(HttpStatusCode.OK).json({ success: true, admin });
		} catch (error: any) {
			logger.error(`❌ Error in AdminLoginController: ${error.message}`);
			next(error);
		}
	}
}

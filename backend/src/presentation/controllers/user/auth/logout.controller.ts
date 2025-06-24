import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { tokenService } from "../../../middlewares/auth.access.token.middleware";
import { logger } from "../../../../infrastructure/utils/logger";

export class LogoutController {
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const refreshToken = req.cookies.refresh_token;

			if (refreshToken) {
				// Set the blacklist TTL same as the refresh token expiry (e.g., 1 day = 86400 seconds)
				const expiry = process.env.JWT_REFRESH_TOKEN_EXPIRES as string;
				await tokenService.blacklistToken(refreshToken, parseInt(expiry));
			}

			// Clear tokens from cookies
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");

			res.status(HttpStatusCode.OK).json({ success: true, message: "Logged out successfully" });
		} catch (error: any) {
			logger.error(`❌ Error in LogoutController: ${error.message}`);
			next(error);
		}
	}
}

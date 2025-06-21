import { Request, Response } from "express";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { tokenService } from "../../../middlewares/auth.access.token.middleware";

export class LogoutController {
	async handle(req: Request, res: Response) {
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
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error from LogoutController: ", error.message);
				res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
				return;
			}
			console.log("An error occurred while logging out: ", error);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while logging out" });
			return;
		}
	}
}

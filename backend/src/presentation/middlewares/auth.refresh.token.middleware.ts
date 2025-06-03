import { Request, Response, NextFunction } from "express";
import { TokenServicesImpl } from "../../infrastructure/auth/jwt/jwt.services";
import { HttpStatusCode } from "../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../shared/constants/string.messages";

const tokenService = new TokenServicesImpl();

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const refreshToken = req.cookies.refresh_token;
		if (!refreshToken) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: CommonStringMessage.TOKEN_NOT_PROVIDED });
			return;
		}

		// const refreshToken = refreshToken.split(" ")[1];
		const decoded = tokenService.validateRefreshToken(refreshToken);

		if (!decoded) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: CommonStringMessage.INVALID_TOKEN });
			return;
		}

		req.user = decoded;
		next();
	} catch (error) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: CommonStringMessage.SERVER_ERROR_MESSAGE });
	}
};

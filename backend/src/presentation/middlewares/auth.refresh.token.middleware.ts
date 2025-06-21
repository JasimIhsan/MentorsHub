import { Request, Response, NextFunction } from "express";
import { TokenServicesImpl } from "../../infrastructure/auth/jwt/jwt.services";
import { HttpStatusCode } from "../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../shared/constants/string.messages";
import { RedisCacheRepository } from "../../infrastructure/cache/redis.cache.repository";

const redisService = new RedisCacheRepository();
const tokenService = new TokenServicesImpl(redisService);

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const refreshToken = req.cookies.refresh_token;
		if (!refreshToken) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: CommonStringMessage.TOKEN_NOT_PROVIDED });
			return;
		}

		const isBlacklisted = await tokenService.isTokenBlacklisted(refreshToken);
		if (isBlacklisted) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			res.status(403).json({ success: false, message: "Refresh token is blacklisted" });
			return;
		}

		// decode and validate token
		const decoded = tokenService.validateRefreshToken(refreshToken);
		if (!decoded) {
			res.status(403).json({ success: false, message: "Invalid token" });
			return;
		}

		req.user = decoded;
		next();
	} catch (error) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: CommonStringMessage.SERVER_ERROR_MESSAGE });
	}
};

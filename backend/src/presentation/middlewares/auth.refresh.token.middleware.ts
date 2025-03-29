import { Request, Response, NextFunction } from "express";
import { TokenServicesImpl } from "../../infrastructure/jwt/jwt.services";
import { AuthenticatedRequest } from "../../types/express";

const tokenService = new TokenServicesImpl();

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const refreshToken = req.cookies.refresh_token;
		console.log("refreshToken : ", refreshToken);
		if (!refreshToken) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			res.status(401).json({ success: false, message: "Refresh token is missing" });
			return;
		}

		// const refreshToken = refreshToken.split(" ")[1];
		const decoded = tokenService.validateRefreshToken(refreshToken);

		if (!decoded) {
			res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
			return;
		}

		req.body = decoded;
		next();
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

import { NextFunction, Request, Response } from "express";
import { TokenServicesImpl } from "../../infrastructure/jwt/jwt.services";
import { AuthenticatedRequest } from "../../types/express";

const tokenService = new TokenServicesImpl();
export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
		console.log(`access token : `, token);
		if (!token) {
			res.status(401).json({ success: false, message: "Token not provided" });
			return;
		}
		const decoded = tokenService.validateAccessToken(token);
		console.log(`decoded : `, decoded);
		if (!decoded) {
			res.status(401).json({ success: false, message: "Invalid token" });
			return;
		}
		(req as any).user = decoded;
		next();
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

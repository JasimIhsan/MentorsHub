import { NextFunction, Request, Response } from "express";
import { TokenServicesImpl } from "../../infrastructure/auth/jwt/jwt.services";
import { UserRepositoryImpl } from "../../infrastructure/database/implementation/user.repository.impl";
import { UserEntity } from "../../domain/entities/user.entity";
import { AdminEntity } from "../../domain/entities/admin.entity";
import { AdminRepositoryImpl } from "../../infrastructure/database/implementation/admin.repository.impl";
import { HttpStatusCode } from "../../shared/constants/http.status.codes";

const tokenService = new TokenServicesImpl();
const userRepo = new UserRepositoryImpl();
const adminRepo = new AdminRepositoryImpl()

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];

		if (!token) {
			res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Token not provided" });
			return;
		}
		const decoded = tokenService.validateAccessToken(token);
		if (!decoded) {
			res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Invalid token" });
			return;
		}

		if (decoded.isAdmin) {
			const admin = await adminRepo.findAdminById(decoded.userId);
			if (!admin) {
				res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Admin not found" });
				return;
			}
			(req.user as AdminEntity) = admin;
			return next();
		} else {
			const user = await userRepo.findUserById(decoded.userId);
			if (!user) {
				res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "User not found" });
				return;
			}
			(req.user as UserEntity) = user;
			return next();
		}
	} catch (error) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
	}
};

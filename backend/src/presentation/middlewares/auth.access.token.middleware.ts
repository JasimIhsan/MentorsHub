import { NextFunction, Request, Response } from "express";
import { TokenServicesImpl } from "../../infrastructure/auth/jwt/jwt.services";
import { UserRepositoryImpl } from "../../infrastructure/database/implementation/user.repository.impl";
import { UserEntity } from "../../domain/entities/user.entity";
import { AdminEntity } from "../../domain/entities/admin.entity";
import { AdminRepositoryImpl } from "../../infrastructure/database/implementation/admin.repository.impl";
import { HttpStatusCode } from "../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../shared/constants/string.messages";
import { RoleEnum } from "../../application/interfaces/role";
import { redisService } from "../../infrastructure/composer";

export const tokenService = new TokenServicesImpl(redisService);
const userRepo = new UserRepositoryImpl();
const adminRepo = new AdminRepositoryImpl();

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
			const adminData = await adminRepo.findAdminById(decoded.userId);
			if (!adminData) {
				res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Admin not found" });
				return;
			}

			const admin = new AdminEntity({
				...adminData,
				id: decoded.userId,
			});
			req.user = { id: admin.getId() as string, role: RoleEnum.ADMIN };
			return next();
		} else {
			const user = await userRepo.findUserById(decoded.userId);
			if (!user) {
				res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: CommonStringMessage.USER_NOT_FOUND });
				return;
			}

			if (user.getStatus() === "blocked") {
				res.status(HttpStatusCode.FORBIDDEN).json({ success: false, blocked: true, message: CommonStringMessage.BLOCKED });
				return;
			}

			req.user = {
				id: user.getId() as string,
				role: user.getRole() === "mentor" ? RoleEnum.MENTOR : RoleEnum.USER,
			};

			return next();
		}
	} catch (error) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: CommonStringMessage.SERVER_ERROR_MESSAGE });
	}
};

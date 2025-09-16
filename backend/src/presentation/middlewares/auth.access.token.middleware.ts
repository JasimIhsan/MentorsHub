import { NextFunction, Request, Response } from "express";
import { TokenServicesImpl } from "../../infrastructure/auth/jwt/jwt.services";
import { UserRepositoryImpl } from "../../infrastructure/database/implementation/user.repository.impl";
import { AdminRepositoryImpl } from "../../infrastructure/database/implementation/admin.repository.impl";
import { HttpStatusCode } from "../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../shared/constants/string.messages";
import { RoleEnum } from "../../application/interfaces/enums/role.enum";
import { redisService } from "../../infrastructure/composer";
import { logger } from "../../infrastructure/utils/logger";
import { UserStatusEnums } from "../../application/interfaces/enums/user.status.enums";

export const tokenService = new TokenServicesImpl(redisService);
const userRepo = new UserRepositoryImpl();
const adminRepo = new AdminRepositoryImpl();

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
		console.log('token: ', token);

		if (!token) {
			res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Token not provided" });
			return;
		}
		const decoded = tokenService.validateAccessToken(token);
		console.log('decoded: ', decoded);
		if (!decoded) {
			res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Invalid token" });
			return;
		}

		if (decoded.isAdmin) {
			const adminEntity = await adminRepo.findAdminById(decoded.userId);
			if (!adminEntity) {
				res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Admin not found" });
				return;
			}

			req.user = { id: adminEntity.id, role: RoleEnum.ADMIN };
			return next();
		} else {
			const user = await userRepo.findUserById(decoded.userId);
			if (!user) {
				res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: CommonStringMessage.USER_NOT_FOUND });
				return;
			}

			if (user.status === UserStatusEnums.BLOCKED) {
				res.status(HttpStatusCode.FORBIDDEN).json({ success: false, blocked: true, message: CommonStringMessage.BLOCKED });
				return;
			}

			req.user = {
				id: user.id as string,
				role: user.role === RoleEnum.MENTOR ? RoleEnum.MENTOR : RoleEnum.USER,
			};

			return next();
		}
	} catch (error) {
		logger.error(`❌ Error in verifyAccessToken: ${error}`);
		next(error);
	}
};

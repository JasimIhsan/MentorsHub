import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../shared/constants/string.messages";
import { RoleEnum } from "../../application/interfaces/enums/role.enum";

// roles can be: 'admin', 'mentor', 'user'
export const requireRole = (...allowedRoles: RoleEnum[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as any;

		if (!user || !user.role) {
			res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: CommonStringMessage.UNAUTHORIZED });
			return;
		}

		if (!allowedRoles.includes(user.role)) {
			res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: CommonStringMessage.FORBIDDEN });
			return;
		}

		next();
	};
};

import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../domain/entities/user.entity";
import { userInfo } from "os";
import { UserRepositoryImpl } from "../../infrastructure/database/implementation/user.repository.impl";
import { HttpStatusCode } from "../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../shared/constants/string.messages";

const userRepo = new UserRepositoryImpl();

export const checkUserStatus = (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as UserEntity;
	if (user.status === "blocked") {
		res.status(HttpStatusCode.FORBIDDEN).json({ success: false, blocked: true, message: CommonStringMessage.BLOCKED });
		return;
	}
	next();
};

export const checkUserStatusInLogin = async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;
	const user = await userRepo.findUserByEmail(email);
	if (!user) {
		return next();
	}

	if (user.status === "blocked") {
		res.status(HttpStatusCode.FORBIDDEN).json({ success: false, blocked: true, message: CommonStringMessage.BLOCKED });
		return;
	}
	next();
};

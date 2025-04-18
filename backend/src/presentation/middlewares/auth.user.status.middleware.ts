import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../domain/entities/user.entity";
import { userInfo } from "os";
import { UserRepositoryImpl } from "../../infrastructure/database/implementation/user/user.repository.impl";

const userRepo = new UserRepositoryImpl();

export const checkUserStatus = (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as UserEntity;
	console.log("user: ", user);

	if (user.getStatus() === "blocked") {
		console.log(`is blocked`);
		res.status(403).json({ success: false, blocked: true, message: "Your account is blocked. Please contact support" });
		return;
	}
	next();
};

export const checkUserStatusInLogin = async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;
	const user = await userRepo.findUserByEmail(email);
	console.log("user: ", user);
	if (!user) {
		return next();
	}

	if (user.getStatus() === "blocked") {
		console.log(`is blocked`);
		res.status(403).json({ success: false, blocked: true, message: "Your account is blocked. Please contact support" });
		return;
	}
	next();
};

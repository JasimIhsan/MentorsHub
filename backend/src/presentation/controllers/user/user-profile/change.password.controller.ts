import { NextFunction, Request, Response } from "express";
import { IChangePasswordUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class ChangePasswordController {
	constructor(private changePasswordUsecase: IChangePasswordUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId, oldPassword, newPassword } = req.body;

			const user = await this.changePasswordUsecase.execute(userId, oldPassword, newPassword);

			res.status(HttpStatusCode.OK).json({ success: true, user });
		} catch (error) {
			logger.error(`❌ Error in ChangePasswordController: ${error}`);
			next(error);
		}
	}
}

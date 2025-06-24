import { NextFunction, Request, Response } from "express";
import { IDeleteUserUsecase } from "../../../../application/interfaces/admin/admin.usertab.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { logger } from "../../../../infrastructure/utils/logger";

export class DeleteUserController {
	constructor(private deleteUserUsecase: IDeleteUserUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.params.id;
			await this.deleteUserUsecase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "User deleted successfully" });
		} catch (error: any) {
			logger.error(`❌ Error in DeleteUserController: ${error.message}`);
			next(error);
		}
	}
}

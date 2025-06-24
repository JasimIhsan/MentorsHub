import { NextFunction, Request, Response } from "express";
import { IUpdateUserStatusUsecase } from "../../../../application/interfaces/admin/admin.usertab.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class UpdateUserStatusController {
	constructor(private updateUserStatusUsecase: IUpdateUserStatusUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { userId } = req.params;
			const updatedUser = await this.updateUserStatusUsecase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, user: updatedUser });
		} catch (error: any) {
			logger.error(`❌ Error in UpdateUserStatusController: ${error.message}`);
			next(error);
		}
	}
}

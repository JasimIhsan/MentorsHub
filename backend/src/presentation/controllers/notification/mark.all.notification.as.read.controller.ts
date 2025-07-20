import { NextFunction, Request, Response } from "express";
import { IMarkAllAsReadUseCase } from "../../../application/interfaces/notification/notification.usecase";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class MarkAllNotificationsAsReadController {
	constructor(private markAllNotificationsAsReadUseCase: IMarkAllAsReadUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.params.userId;
			await this.markAllNotificationsAsReadUseCase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "All notifications marked as read" });
		} catch (error) {
			logger.error(`❌ Error in MarkAllNotificationsAsReadController: ${error}`);
			next(error);
		}
	}
}

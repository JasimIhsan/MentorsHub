import { NextFunction, Request, Response } from "express";
import { IMarkAsReadUseCase } from "../../../application/interfaces/notification/notification.usecase";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class MarkNotificationAsReadController {
	constructor(private markNotificationAsReadUseCase: IMarkAsReadUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const notificationId = req.params.notificationId;
			await this.markNotificationAsReadUseCase.execute(notificationId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Notification marked as read" });
		} catch (error) {
			logger.error(`❌ Error in MarkNotificationAsReadController: ${error}`);
			next(error);
		}
	}
}

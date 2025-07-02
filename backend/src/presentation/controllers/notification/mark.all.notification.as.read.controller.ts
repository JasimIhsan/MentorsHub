import { NextFunction, Request, Response } from "express";
import { IMarkAllAsReadUseCase } from "../../../application/interfaces/notification";
import { logger } from "../../../infrastructure/utils/logger";

export class MarkAllNotificationsAsReadController {
	constructor(private markAllNotificationsAsReadUseCase: IMarkAllAsReadUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.params.userId;
			await this.markAllNotificationsAsReadUseCase.execute(userId);
			res.status(200).json({ success: true, message: "All notifications marked as read" });
		} catch (error) {
			logger.error(`❌ Error in MarkAllNotificationsAsReadController: ${error}`);
			next(error);
		}
	}
}

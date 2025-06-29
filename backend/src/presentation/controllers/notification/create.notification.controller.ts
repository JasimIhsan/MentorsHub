import { NextFunction, Request, Response } from "express";
import { ICreateNotificationUseCase } from "../../../application/interfaces/notification";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class CreateNotificationController {
	constructor(private createNotificationUseCase: ICreateNotificationUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId, title, message, type } = req.body;
			const notification = await this.createNotificationUseCase.execute(userId, title, message, type);
			res.status(HttpStatusCode.OK).json({ success: true, data: notification });
		} catch (error) {
			logger.error(`❌ Error in CreateNotificationController: ${error}`);
			next(error);
		}
	}
}

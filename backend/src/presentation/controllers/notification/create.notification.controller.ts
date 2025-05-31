import { Request, Response } from "express";
import { ICreateNotificationUseCase } from "../../../application/interfaces/notification";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class CreateNotificationController {
	constructor(private createNotificationUseCase: ICreateNotificationUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			const { userId, title, message, type } = req.body;
			const notification = await this.createNotificationUseCase.execute(userId, title, message, type);
			res.status(HttpStatusCode.OK).json({ success: true, data: notification });
		} catch (error) {
			console.error(error);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create notification" });
		}
	}
}

import { Request, Response } from "express";
import { IGetUserNotificationsUseCase } from "../../../application/interfaces/notification";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetUserNotificationsController {
	constructor(private getUserNotificationsUseCase: IGetUserNotificationsUseCase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.userId;
			const notifications = await this.getUserNotificationsUseCase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, data: notifications });
		} catch (error) {
			console.error(error);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch notifications" });
		}
	}
}

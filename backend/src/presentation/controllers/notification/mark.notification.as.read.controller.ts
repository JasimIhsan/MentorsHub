import { Request, Response } from "express";
import { IMarkAsReadUseCase } from "../../../application/interfaces/notification";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class MarkNotificationAsReadController {
	constructor(private markNotificationAsReadUseCase: IMarkAsReadUseCase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const notificationId = req.params.notificationId;
			await this.markNotificationAsReadUseCase.execute(notificationId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Notification marked as read" });
		} catch (error) {
			console.error(error);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to mark as read" });
		}
	}
}

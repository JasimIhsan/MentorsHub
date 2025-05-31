import { Request, Response } from "express";
import { IMarkAllAsReadUseCase } from "../../../application/interfaces/notification";

export class MarkAllNotificationsAsReadController {
	constructor(private markAllNotificationsAsReadUseCase: IMarkAllAsReadUseCase) {}
	async handle(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.userId;
			await this.markAllNotificationsAsReadUseCase.execute(userId);
			res.status(200).json({ success: true, message: "All notifications marked as read" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ success: false, message: "Failed to mark all as read" });
		}
	}
}

import { Request, Response } from "express";
import { IGetUserNotificationsUseCase } from "../../../application/interfaces/notification";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetUserNotificationsController {
	constructor(private getUserNotificationsUseCase: IGetUserNotificationsUseCase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.userId;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 5;
			const isRead = req.query.isRead !== undefined ? req.query.isRead === "true" : undefined;
			const search = (req.query.search as string) || "";

			const result = await this.getUserNotificationsUseCase.execute({
				userId,
				page,
				limit,
				isRead,
				search,
			});

			res.status(HttpStatusCode.OK).json({
				success: true,
				data: result,
			});
		} catch (error) {
			console.error(error);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch notifications" });
		}
	}
}

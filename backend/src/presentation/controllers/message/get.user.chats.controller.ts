import { NextFunction, Request, Response } from "express";
import { IGetUserChatsUseCase } from "../../../application/interfaces/messages";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class GetUserChatsController {
	constructor(private getUserChatsUseCase: IGetUserChatsUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;
			const chats = await this.getUserChatsUseCase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, chats });
		} catch (error: any) {
			logger.error(`❌ Error in GetUserChatsController: ${error.message}`);
			next(error);
		}
	}
}

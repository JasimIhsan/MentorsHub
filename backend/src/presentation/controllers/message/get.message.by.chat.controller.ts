import { NextFunction, Request, Response } from "express";
import { IGetMessagesByChatUseCase } from "../../../application/interfaces/messages";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class GetMessagesByChatController {
	constructor(private getMessageByChatUseCase: IGetMessagesByChatUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { chatId } = req.params;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const messages = await this.getMessageByChatUseCase.execute(chatId, page, limit);
			res.status(HttpStatusCode.OK).json({ success: true, messages });
		} catch (error: any) {
			logger.error(`❌ Error in GetMessagesByChatController: ${error.message}`);
			next(error);
		}
	}
}

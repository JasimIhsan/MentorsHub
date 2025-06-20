import { Request, Response } from "express";
import { IGetMessagesByChatUseCase } from "../../../application/interfaces/messages";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetMessagesByChatController {
	constructor(private getMessageByChatUseCase: IGetMessagesByChatUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { chatId } = req.params;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const messages = await this.getMessageByChatUseCase.execute(chatId, page, limit);
			res.status(HttpStatusCode.OK).json({ success: true, messages });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

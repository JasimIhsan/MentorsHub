import { Request, Response } from "express";
import { IGetUserChatsUseCase } from "../../../application/interfaces/chats";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetUserChatsController {
	constructor(private getUserChatsUseCase: IGetUserChatsUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const chats = await this.getUserChatsUseCase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, chats });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

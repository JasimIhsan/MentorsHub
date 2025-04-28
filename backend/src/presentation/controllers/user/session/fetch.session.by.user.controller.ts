import { Request, Response } from "express";
import { IFetchSessionsByUserUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class FetchSessionByUserController {
	constructor(private fetchSessionByUserUsecase: IFetchSessionsByUserUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const userId = req.params.userId;
			const sessions = await this.fetchSessionByUserUsecase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, sessions });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

import { Request, Response } from "express";
import { IFetchSessionsByUserUseCase } from "../../../../application/interfaces/session";

export class FetchSessionByUserController {
	constructor(private fetchSessionByUserUsecase: IFetchSessionsByUserUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const userId = req.params.userId;
			const sessions = await this.fetchSessionByUserUsecase.execute(userId);
			console.log('sessions by userId: ', sessions);

			res.status(200).json({ success: true, sessions });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

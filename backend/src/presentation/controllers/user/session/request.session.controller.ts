import { Request, Response } from "express";
import { IRequestSessionUseCase } from "../../../../application/interfaces/session";

export class RequestSessionController {
	constructor(private requestSessionUsecase: IRequestSessionUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const requestData = req.body;

			const session = await this.requestSessionUsecase.execute(requestData);
			res.status(200).json({ success: true, session, message: "Session requested successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

import { Request, Response } from "express";
import { IRequestSessionUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class RequestSessionController {
	constructor(private requestSessionUsecase: IRequestSessionUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const requestData = req.body;
			console.log(`request data date in controller : `, requestData.date);

			const session = await this.requestSessionUsecase.execute(requestData);
			res.status(HttpStatusCode.OK).json({ success: true, session, message: "Session requested successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

import { Request, Response } from "express";
import { IStartSessionUseCase } from "../../../application/interfaces/session";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class StartSessionController {
	constructor(private startSessionUsecase: IStartSessionUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { sessionId } = req.params;
			console.log("sessionId: ", sessionId);
			// await this.startSessionUsecase.execute(sessionId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Session started successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

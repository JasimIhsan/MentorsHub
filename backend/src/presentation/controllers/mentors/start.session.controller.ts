import { Request, Response } from "express";
import { IStartSessionUsecase } from "../../../application/interfaces/session";

export class StartSessionController {
	constructor(private startSessionUsecase: IStartSessionUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const { sessionId } = req.params;
			console.log("sessionId: ", sessionId);
			// await this.startSessionUsecase.execute(sessionId);
			res.status(200).json({ success: true, message: "Session started successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

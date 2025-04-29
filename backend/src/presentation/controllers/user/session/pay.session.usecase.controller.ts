import { Request, Response } from "express";
import { IPaySessionUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class PaySessionController {
	constructor(private paySessionUsecase: IPaySessionUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { sessionId, userId, paymentId, paymentStatus, status } = req.body;
			if (!sessionId || !paymentId || !paymentStatus || !status) {
				res.status(400).json({ success: false, message: "All fields are required" });
				return;
			}
			await this.paySessionUsecase.execute(sessionId, userId, paymentId, paymentStatus, status);
			res.status(200).json({ success: true, message: "Session paid successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

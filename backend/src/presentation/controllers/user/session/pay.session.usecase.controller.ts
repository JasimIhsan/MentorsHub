import { Request, Response } from "express";
import { IPaySessionUseCase } from "../../../../application/interfaces/session";

export class PaySessionController {
	constructor(private paySessionUsecase: IPaySessionUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { sessionId, paymentId, paymentStatus, status } = req.body;
			console.log('status: ', status);
			console.log('paymentStatus: ', paymentStatus);
			console.log('paymentId: ', paymentId);
			console.log('sessionId: ', sessionId);

			if(!sessionId || !paymentId || !paymentStatus || !status) {
				res.status(400).json({ success: false, message: "All fields are required" });
				return;
			}
			await this.paySessionUsecase.execute(sessionId, paymentId, paymentStatus, status);
			res.status(200).json({ success: true, message: "Session paid successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

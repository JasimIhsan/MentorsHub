import { Request, Response } from "express";
import { IPaySessionUseCase } from "../../../../application/interfaces/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

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
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "All fields are required" });
				return;
			}
			await this.paySessionUsecase.execute(sessionId, paymentId, paymentStatus, status);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Session paid successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

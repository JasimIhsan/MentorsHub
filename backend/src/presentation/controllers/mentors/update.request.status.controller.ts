import { Request, Response } from "express";
import { IUpdateRequestStatusUseCase } from "../../../application/interfaces/session";

export class UpdateRequestStatusController {
	constructor(private updateRequestStatusUsecase: IUpdateRequestStatusUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { requestId } = req.params;
			const { status } = req.body;
			console.log(`requestId : `, requestId);
			console.log(`status : `, status);
			await this.updateRequestStatusUsecase.execute(requestId, status);
			res.status(200).json({ success: true, message: "Request status updated successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

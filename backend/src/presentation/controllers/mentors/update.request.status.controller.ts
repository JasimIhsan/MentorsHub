import { Request, Response } from "express";
import { IUpdateRequestStatusUseCase } from "../../../application/interfaces/session";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class UpdateRequestStatusController {
	constructor(private updateRequestStatusUsecase: IUpdateRequestStatusUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { requestId } = req.params;
			const { status, rejectReason } = req.body;
			await this.updateRequestStatusUsecase.execute(requestId, status, rejectReason);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Request updated successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

import { Request, Response } from "express";
import { IUpdateSessionStatusUseCase } from "../../../application/interfaces/session";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class UpdateSessionStatusController {
	constructor(private updateSessionStatusUsecase: IUpdateSessionStatusUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { requestId } = req.params;
			const { status, rejectReason } = req.body;
			await this.updateSessionStatusUsecase.execute(requestId, status, rejectReason);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Request updated successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

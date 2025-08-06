import { NextFunction, Request, Response } from "express";
import { IUpdateSessionStatusUseCase } from "../../../application/interfaces/session";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class UpdateSessionStatusController {
	constructor(private updateSessionStatusUsecase: IUpdateSessionStatusUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { requestId } = req.params;
			const { status, reason } = req.body;
			console.log("reason: ", reason);
			await this.updateSessionStatusUsecase.execute(requestId, status, reason);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Request updated successfully" });
		} catch (error) {
			logger.error(`❌ Error in UpdateSessionStatusController: ${error}`);
			next(error);
		}
	}
}

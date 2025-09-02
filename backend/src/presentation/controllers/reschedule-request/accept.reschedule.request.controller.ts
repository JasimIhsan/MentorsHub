import { Request, Response, NextFunction } from "express";
import { IAcceptRescheduleRequestUseCase } from "../../../application/interfaces/usecases/reschedule.request";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class AcceptRescheduleRequestController {
	constructor(private readonly _useCase: IAcceptRescheduleRequestUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId, userId } = req.params;
			const { isCounter } = req.body;
			const session = await this._useCase.execute(userId, sessionId, isCounter);

			res.status(HttpStatusCode.OK).json({ success: true, session, message: "Request accepted successfully" });
		} catch (error) {
			logger.error(`❌ Error in AcceptRescheduleRequestController: ${error}`);
			next(error);
		}
	}
}

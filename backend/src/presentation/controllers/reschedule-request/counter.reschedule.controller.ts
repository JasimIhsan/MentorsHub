import { Request, Response, NextFunction } from "express";
import { ICounterRescheduleRequestUseCase, ICreateRescheduleRequestUsecase } from "../../../application/interfaces/reschedule.request";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class CouterRescheduleRequestController {
	constructor(private readonly _useCase: ICounterRescheduleRequestUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId, userId } = req.params;
			const { startTime, endTime, message, date } = req.body;

			const request = await this._useCase.execute(userId, sessionId, startTime, endTime, message, new Date(date));

			res.status(HttpStatusCode.OK).json({ success: true, request, message: "Request sent successfully" });
		} catch (error) {
			console.log(`❌ Error in CouterRescheduleRequestController: ${error}`);
			logger.error(`❌ Error in CouterRescheduleRequestController: ${error}`);
			next(error);
		}
	}
}

import { Request, Response, NextFunction } from "express";
import { ICreateRescheduleRequestUsecase } from "../../../application/interfaces/usecases/reschedule.request";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class RescheduleSessionController {
	constructor(private readonly _useCase: ICreateRescheduleRequestUsecase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId } = req.params;
			const { userId, date, startTime, endTime, message } = req.body;

			const request = await this._useCase.execute({
				proposedDate: new Date(date),
				proposedStartTime: startTime,
				proposedEndTime: endTime,
				message,
				sessionId,
				userId,
			});

			res.status(HttpStatusCode.OK).json({ success: true, request });
		} catch (error) {
			console.log(`❌ Error in RescheduleSessionController: ${error}`);
			logger.error(`❌ Error in RescheduleSessionController: ${error}`);
			next(error);
		}
	}
}

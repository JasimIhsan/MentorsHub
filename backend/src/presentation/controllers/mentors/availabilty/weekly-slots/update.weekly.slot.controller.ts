import { Request, Response, NextFunction } from "express";
import { IUpdateWeeklySlotUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class UpdateWeeklySlotController {
	constructor(private readonly _useCase: IUpdateWeeklySlotUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId, slotId } = req.params;
			const { startTime, endTime } = req.body;
			await this._useCase.execute(slotId, mentorId, startTime, endTime);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Slot updated successfully" });
		} catch (error) {
			console.log(`❌ Error in UpdateWeeklySlotController: ${error}`);
			logger.error(`❌ Error in UpdateWeeklySlotController: ${error}`);
			next(error);
		}
	}
}

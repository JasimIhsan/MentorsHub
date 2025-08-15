import { Request, Response, NextFunction } from "express";
import { IToggleAvailabilityByWeekDayUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class ToggleAvailabilityByWeekDayController {
	constructor(private readonly _useCase: IToggleAvailabilityByWeekDayUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const { dayOfWeek, status } = req.body;
			console.log("status: ", status);
			await this._useCase.execute(mentorId, parseInt(dayOfWeek), status);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Availability updated successfully" });
		} catch (error) {
			console.log(`❌ Error in ToggleAvailabilityByWeekDayController: ${error}`);
			logger.error(`❌ Error in ToggleAvailabilityByWeekDayController: ${error}`);
			next(error);
		}
	}
}

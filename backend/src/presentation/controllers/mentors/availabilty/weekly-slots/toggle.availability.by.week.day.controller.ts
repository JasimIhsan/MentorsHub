import { Request, Response, NextFunction } from "express";
import { IToggleAvailabilityByWeekDayUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";

export class ToggleAvailabilityByWeekDayController {
	constructor(private readonly toggleAvailabilityByWeekDayUseCase: IToggleAvailabilityByWeekDayUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const { dayOfWeek, status } = req.body;
			await this.toggleAvailabilityByWeekDayUseCase.execute(mentorId, parseInt(dayOfWeek), status);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Availability updated successfully" });
		} catch (error) {
			logger.error(`❌ Error in ToggleAvailabilityByWeekDayController: ${error}`);
			next(error);
		}
	}
}

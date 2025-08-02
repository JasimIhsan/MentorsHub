import { Request, Response, NextFunction } from "express";
import { IToggleAvailabilityByWeekDayUseCase } from "../../../../application/interfaces/mentors/mentor.availability.interfaces";
import { logger } from "../../../../infrastructure/utils/logger";

export class ToggleAvailabilityByWeekDayController {
	constructor(private readonly _useCase: IToggleAvailabilityByWeekDayUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const { dayOfWeek, status } = req.body;
			await this._useCase.execute(mentorId, parseInt(dayOfWeek), status);
			res.status(200).json({ success: true, message: "Availability updated successfully" });
		} catch (error) {
			console.log(`❌ Error in ToggleAvailabilityByWeekDayController: ${error}`);
			logger.error(`❌ Error in ToggleAvailabilityByWeekDayController: ${error}`);
			next(error);
		}
	}
}

import { Request, Response, NextFunction } from "express";
import { IToggleAvailabilityWeeklySlotUseCase } from "../../../../../application/interfaces/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";
import { logger } from "../../../../../infrastructure/utils/logger";

export class ToggleActiveWeeklyAvailabilityController {
	constructor(private readonly _useCase: IToggleAvailabilityWeeklySlotUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId, slotId } = req.params;
			await this._useCase.execute(slotId, mentorId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Slot updated successfully" });
		} catch (error) {
			console.log(`❌ Error in ToggleActiveWeeklyAvailabilityController: ${error}`);
			logger.error(`❌ Error in ToggleActiveWeeklyAvailabilityController: ${error}`);
			next(error);
		}
	}
}

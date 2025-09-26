import { Request, Response, NextFunction } from "express";
import { IToggleAvailabilityWeeklySlotUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";
import { logger } from "../../../../../infrastructure/utils/logger";

export class ToggleActiveWeeklyAvailabilityController {
	constructor(private readonly toggleAvailabilityWeeklySlotUseCase: IToggleAvailabilityWeeklySlotUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId, slotId } = req.params;
			await this.toggleAvailabilityWeeklySlotUseCase.execute(slotId, mentorId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Slot updated successfully" });
		} catch (error) {
			logger.error(`❌ Error in ToggleActiveWeeklyAvailabilityController: ${error}`);
			next(error);
		}
	}
}

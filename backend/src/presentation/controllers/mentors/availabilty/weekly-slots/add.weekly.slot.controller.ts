import { Request, Response, NextFunction } from "express";
import { IAddSlotAvailabilityToWeekUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";
import { logger } from "../../../../../infrastructure/utils/logger";

export class AddWeeklySlotController {
	constructor(private readonly addSlotAvailabilityToWeekUseCase: IAddSlotAvailabilityToWeekUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const { day, startTime, endTime } = req.body;
			const slot = await this.addSlotAvailabilityToWeekUseCase.execute(mentorId, parseInt(day), startTime, endTime);
			res.status(HttpStatusCode.OK).json({ success: true, slot });
		} catch (error) {
			logger.error(`❌ Error in AddWeeklySlotController: ${error}`);
			next(error);
		}
	}
}

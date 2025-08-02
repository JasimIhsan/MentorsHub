import { Request, Response, NextFunction } from "express";
import { IAddSlotAvailabilityToWeekUseCase } from "../../../../../application/interfaces/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";
import { logger } from "../../../../../infrastructure/utils/logger";
import { parse } from "path";

export class AddWeeklySlotController {
	constructor(private readonly _useCase: IAddSlotAvailabilityToWeekUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			console.log("mentorId: ", mentorId);
			const { day, startTime, endTime } = req.body;
			console.log(`req.body : `, req.body);
			const slot = await this._useCase.execute(mentorId, parseInt(day), startTime, endTime);
			res.status(HttpStatusCode.OK).json({ success: true, slot });
		} catch (error) {
			console.log(`❌ Error in AddWeeklySlotController: ${error}`);
			logger.error(`❌ Error in AddWeeklySlotController: ${error}`);
			next(error);
		}
	}
}

import { Request, Response, NextFunction } from "express";
import { IAddSpecialSlotUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";
import { logger } from "../../../../../infrastructure/utils/logger";

export class AddSpecialSlotController {
	constructor(private readonly _useCase: IAddSpecialSlotUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const { startTime, endTime, date } = req.body;
			const slot = await this._useCase.execute(mentorId, new Date(date), startTime, endTime);
			res.status(HttpStatusCode.OK).json({ success: true, slot, message: "Slot added successfully" });
		} catch (error) {
			console.log(`❌ Error in AddSpecialSlotController: ${error}`);
			logger.error(`❌ Error in AddSpecialSlotController: ${error}`);
			next(error);
		}
	}
}

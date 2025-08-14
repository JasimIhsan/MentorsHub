import { Request, Response, NextFunction } from "express";
import { IUpdateSpecialSlotUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";
import { logger } from "../../../../../infrastructure/utils/logger";

export class UpdateSpecialSlotController {
	constructor(private readonly _useCase: IUpdateSpecialSlotUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId, slotId } = req.params;
			const { startTime, endTime } = req.body;

			await this._useCase.execute(slotId, mentorId, startTime, endTime);

			res.status(HttpStatusCode.OK).json({ success: true, message: "Slot updated successfully" });
		} catch (error) {
			console.log(`❌ Error in UpdateSpecialSlotController: ${error}`);
			logger.error(`❌ Error in UpdateSpecialSlotController: ${error}`);
			next(error);
		}
	}
}

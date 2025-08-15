import { Request, Response, NextFunction } from "express";
import { IDeleteSpecialSlotUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";
import { logger } from "../../../../../infrastructure/utils/logger";

export class DeleteSpecialSlotController {
	constructor(private readonly _useCase: IDeleteSpecialSlotUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId, slotId } = req.params;
			await this._useCase.execute(slotId, mentorId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Slot deleted successfully" });
		} catch (error) {
			console.log(`❌ Error in DeleteSpecialSlotController: ${error}`);
			logger.error(`❌ Error in DeleteSpecialSlotController: ${error}`);
			next(error);
		}
	}
}

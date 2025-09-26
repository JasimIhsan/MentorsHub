import { Request, Response, NextFunction } from "express";
import { IDeleteSpecialSlotUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";
import { logger } from "../../../../../infrastructure/utils/logger";

export class DeleteSpecialSlotController {
	constructor(private readonly deleteSpecialSlotUseCase: IDeleteSpecialSlotUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId, slotId } = req.params;
			await this.deleteSpecialSlotUseCase.execute(slotId, mentorId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Slot deleted successfully" });
		} catch (error) {
			logger.error(`❌ Error in DeleteSpecialSlotController: ${error}`);
			next(error);
		}
	}
}

import { Request, Response, NextFunction } from "express";
import { IDeleteWeeklySlotUsecase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../../shared/constants/http.status.codes";
import { logger } from "../../../../../infrastructure/utils/logger";

export class DeleteWeeklySlotController {
	constructor(private readonly deleteWeeklySlotUseCase: IDeleteWeeklySlotUsecase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId, slotId } = req.params;
			await this.deleteWeeklySlotUseCase.execute(slotId, mentorId);
			res.status(HttpStatusCode.OK).json({ success: true });
		} catch (error) {
			logger.error(`❌ Error in DeleteWeeklySlotController: ${error}`);
			next(error);
		}
	}
}

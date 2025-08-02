import { Request, Response, NextFunction } from "express";
import { IGetAllWeeklyAvailabilityUseCase } from "../../../../application/interfaces/mentors/mentor.availability.interfaces";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetAllWeeklyAvailabilityController {
	constructor(private readonly _useCase: IGetAllWeeklyAvailabilityUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const mentorId = req.params.mentorId;
			console.log('mentorId: ', mentorId);
			const slots = await this._useCase.execute(mentorId);
			res.status(200).json({ success: true, slots });
		} catch (error) {
			console.log(`❌ Error in GetAllWeeklyAvailabilityController: ${error}`);
			logger.error(`❌ Error in GetAllWeeklyAvailabilityController: ${error}`);
			next(error);
		}
	}
}

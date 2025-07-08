import { Request, Response, NextFunction } from "express";
import { IGetMentorWeeklyPerformanceUseCase } from "../../../../application/interfaces/mentors/mentor.dashboard.interface";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetMentorWeeklyPerformanceController {
	constructor(private readonly _useCase: IGetMentorWeeklyPerformanceUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const mentorId = req.params.mentorId;
			const period = req.query.period;
			const performance = await this._useCase.execute(mentorId, period as "month" | "sixMonths" | "year");
			res.status(200).json({ success: true, performance });
		} catch (error) {
			logger.error(`❌ Error in GetMentorWeeklyPerformanceController: ${error}`);
			next(error);
		}
	}
}

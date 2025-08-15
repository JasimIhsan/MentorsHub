import { Request, Response, NextFunction } from "express";
import { IGetMentorWeeklyRatingsUseCase } from "../../../../application/interfaces/usecases/mentors/mentor.dashboard.interface";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetMentorWeeklyRatingsController {
	constructor(private useCase: IGetMentorWeeklyRatingsUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const mentorId = req.params.mentorId;
			const period = req.query.period;
			const weeklyRatings = await this.useCase.execute(mentorId, period as "all" | "month" | "sixMonths" | "year");
			res.status(HttpStatusCode.OK).json({ success: true, weeklyRatings });
		} catch (error) {
			logger.error(`❌ Error in GetMentorWeeklyRatingsController: ${error}`);
			next(error);
		}
	}
}

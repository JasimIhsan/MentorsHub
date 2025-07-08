import { Request, Response, NextFunction } from "express";
import { IGetMentorStatsUseCase } from "../../../../application/interfaces/mentors/mentor.dashboard.interface";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetMentorStatsController {
	constructor(private useCase: IGetMentorStatsUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.mentorId;
			const stats = await this.useCase.execute(userId);
			res.status(200).json({ success: true, stats });
		} catch (error) {
			logger.error(`❌ Error in GetMentorStatsController: ${error}`);
			next(error);
		}
	}
}

import { Request, Response, NextFunction } from "express";
import { IGetMentorStatsUseCase } from "../../../../application/interfaces/usecases/mentors/mentor.dashboard.interface";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetMentorStatsController {
	constructor(private readonly getMentorStatsUseCase: IGetMentorStatsUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.mentorId;
			const stats = await this.getMentorStatsUseCase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, stats });
		} catch (error) {
			logger.error(`❌ Error in GetMentorStatsController: ${error}`);
			next(error);
		}
	}
}

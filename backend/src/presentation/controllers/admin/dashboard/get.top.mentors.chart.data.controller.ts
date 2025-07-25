import { Request, Response, NextFunction } from "express";
import { IGetTopMentorsUseCase } from "../../../../application/interfaces/admin/admin.dashboard.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetTopMentorsChartDataController {
	constructor(private readonly _useCase: IGetTopMentorsUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const topMentors = await this._useCase.execute();
			res.status(HttpStatusCode.OK).json({ success: true, topMentors });
		} catch (error) {
			logger.error(`❌ Error in GetTopMentorsChartDataController: ${error}`);
			next(error);
		}
	}
}

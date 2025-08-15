import { Request, Response, NextFunction } from "express";
import { IGetReportsUseCase } from "../../../../application/interfaces/usecases/reports";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetReportsController {
	constructor(private readonly _useCase: IGetReportsUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { search, status } = req.query;

			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			const reports = await this._useCase.execute(page, limit, search as string, status as string);
			res.status(HttpStatusCode.OK).json({ success: true, reports: reports.reports, total: reports.totalCount });
		} catch (error) {
			console.error(`❌❌❌ Error in GetReportsController: ${error}`);
			logger.error(`❌ Error in GetReportsController: ${error}`);
			next(error);
		}
	}
}

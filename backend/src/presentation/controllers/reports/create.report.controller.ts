import { Request, Response, NextFunction } from "express";
import { ICreateReportUseCase } from "../../../application/interfaces/usecases/reports";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class CreateReportController {
	constructor(private readonly _usesCase: ICreateReportUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { reporterId, reportedId, reason } = req.body;
			await this._usesCase.execute({ reporterId, reportedId, reason });
			res.status(HttpStatusCode.OK).json({ success: true });
		} catch (error) {
			logger.error(`❌ Error in CreateReportController: ${error}`);
			next(error);
		}
	}
}

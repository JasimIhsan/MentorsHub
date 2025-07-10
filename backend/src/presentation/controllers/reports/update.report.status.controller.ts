import { Request, Response, NextFunction } from "express";
import { IUpdateReportStatusUseCase } from "../../../application/interfaces/reports";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class UpdateReportStatusController {
	constructor(private readonly _useCase: IUpdateReportStatusUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { reportId } = req.params;
			const { status, adminNote } = req.body;
			const report = await this._useCase.execute(reportId, status, adminNote);
			res.status(HttpStatusCode.OK).json({ success: true, report });
		} catch (error) {
			logger.error(`❌ Error in UpdateReportStatusController: ${error}`);
			next(error);
		}
	}
}

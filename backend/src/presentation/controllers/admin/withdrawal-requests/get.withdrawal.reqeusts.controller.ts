import { Request, Response, NextFunction } from "express";
import { IGetWithdrawalRequestsUseCase } from "../../../../application/interfaces/usecases/withdrawal.request";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetWithdrawalRequestsController {
	constructor(private readonly _useCase: IGetWithdrawalRequestsUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit, status, searchTerm } = req.query;
			const result = await this._useCase.execute({ page: parseInt(page as string), limit: parseInt(limit as string), status: status as string, searchTerm: searchTerm as string });

			res.status(HttpStatusCode.OK).json({ success: true, requests: result.requests, total: result.totalCount });
		} catch (error) {
			logger.error(`❌ Error in GetWithdrawalRequestsController: ${error}`);
			next(error);
		}
	}
}

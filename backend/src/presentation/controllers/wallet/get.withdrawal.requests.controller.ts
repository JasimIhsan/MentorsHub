import { NextFunction, Request, Response } from "express";
import { IGetWithdrawalRequestsUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class GetWithdrawalRequestsController {
	constructor(private getWithdrawalRequestsUseCase: IGetWithdrawalRequestsUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		try {
			const result = await this.getWithdrawalRequestsUseCase.execute(req.params.mentorId, page, limit, {});
			res.status(HttpStatusCode.OK).json({ success: true, withdrawalRequests: result.data, total: result.total });
		} catch (error: any) {
			logger.error(`❌ Error in GetWithdrawalRequestsController: ${error.message}`);
			next(error);
		}
	}
}

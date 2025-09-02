import { Request, Response, NextFunction } from "express";
import { IApproveWithdrawalRequestUseCase } from "../../../../application/interfaces/usecases/withdrawal.request";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class ApproveWithdrawalRequestController {
	constructor(private readonly _useCase: IApproveWithdrawalRequestUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { requestId } = req.params;
			const { paymentId } = req.body;
			const request = await this._useCase.execute(requestId, paymentId);
			res.status(HttpStatusCode.OK).json({ success: true, request });
		} catch (error) {
			logger.error(`❌ Error in ApproveWithdrawalRequestController: ${error}`);
			next(error);
		}
	}
}

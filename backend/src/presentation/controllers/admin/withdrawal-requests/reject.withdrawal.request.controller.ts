import { Request, Response, NextFunction } from "express";
import { IRejectWithdrawalRequestUseCase } from "../../../../application/interfaces/usecases/withdrawal.request";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class RejectWithdrawalRequestController {
	constructor(private readonly _useCase: IRejectWithdrawalRequestUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { requestId } = req.params;
			const reqeust = await this._useCase.execute(requestId);
			res.status(HttpStatusCode.OK).json({ success: true, reqeust, message: "Request rejected successfully" });
		} catch (error) {
			logger.error("❌ Error in RejectWithdrawalRequestController: ", error);
			next(error);
		}
	}
}

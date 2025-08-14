import { NextFunction, Request, Response } from "express";
import { ICreateWithdrawalRequestUsecase } from "../../../application/interfaces/usecases/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class CreateWithdrawalRequestController {
	constructor(private createWithdrawalRequestUseCase: ICreateWithdrawalRequestUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const request = await this.createWithdrawalRequestUseCase.execute(req.body);
			res.status(HttpStatusCode.CREATED).json({ success: true, request });
		} catch (error) {
			logger.error(`❌ Error in CreateWithdrawalRequestController: ${error}`);
			next(error);
		}
	}
}

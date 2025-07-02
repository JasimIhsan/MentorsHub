import { NextFunction, Request, Response } from "express";
import { ICreateTransactionUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class CreateTransactionController {
	constructor(private createTransactionUseCase: ICreateTransactionUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const tx = await this.createTransactionUseCase.execute(req.body);
			res.status(HttpStatusCode.CREATED).json({ success: true, data: tx });
		} catch (error) {
			logger.error(`❌ Error in CreateTransactionController: ${error}`);
			next(error);
		}
	}
}

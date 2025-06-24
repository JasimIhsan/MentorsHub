import { NextFunction, Request, Response } from "express";
import { ICreateWalletUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class CreateWalletController {
	constructor(private createWalletUseCase: ICreateWalletUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		const { userId, role } = req.body;
		try {
			const wallet = await this.createWalletUseCase.execute(userId, role);
			res.status(HttpStatusCode.CREATED).json({ success: true, wallet });
		} catch (error: any) {
			logger.error(`❌ Error in CreateWalletController: ${error.message}`);
			next(error);
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { IGetWalletUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class GetWalletController {
	constructor(private getWalletUseCase: IGetWalletUsecase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;

			const wallet = await this.getWalletUseCase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, wallet });
		} catch (error: any) {
			logger.error(`❌ Error in GetWalletController: ${error.message}`);
			next(error);
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { IWithdrawWalletUsecase } from "../../../application/interfaces/usecases/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class WithdrawWalletController {
	constructor(private withdrawWalletUseCase: IWithdrawWalletUsecase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;
			const { amount } = req.body;
			const wallet = await this.withdrawWalletUseCase.execute(userId, amount);
			res.status(HttpStatusCode.OK).json({ success: true, wallet: wallet.wallet, transaction: wallet.transaction });
		} catch (error) {
			logger.error(`❌ Error in WithdrawWalletController: ${error}`);
			next(error);
		}
	}
}

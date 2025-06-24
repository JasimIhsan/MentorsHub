import { NextFunction, Request, Response } from "express";
import { IWithdrawWalletUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class WithdrawWalletController {
	constructor(private withdrawWalletUseCase: IWithdrawWalletUsecase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;
			const { amount } = req.body;
			const wallet = await this.withdrawWalletUseCase.execute(userId, amount);
			res.status(HttpStatusCode.OK).json({ success: true, wallet: wallet.wallet, transaction: wallet.transaction });
		} catch (error) {
			console.log('Error from withdrawalWalletController: ', error);
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

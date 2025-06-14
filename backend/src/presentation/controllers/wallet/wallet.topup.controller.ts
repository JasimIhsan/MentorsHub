// interfaces/controllers/wallet/topup.wallet.controller.ts

import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { IWalletTopUpUsecase } from "../../../application/interfaces/wallet";

export class WalletTopUpController {
	constructor(private topUpUseCase: IWalletTopUpUsecase) {}

	async handle(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const { amount, purpose, description } = req.body;
			console.log(`req.body : `, req.body);
			console.log(`userId : `, userId);

			if(!amount || !purpose || !description || !userId) throw new Error("Missing required fields.");

			const result = await this.topUpUseCase.execute({ userId, amount, purpose, description });

			res.status(HttpStatusCode.OK).json({
				success: true,
				message: "Wallet topped up successfully.",
				data: result,
			});
		} catch (error: any) {
			res.status(HttpStatusCode.BAD_REQUEST).json({
				success: false,
				message: error.message || "Failed to top up wallet",
			});
		}
	}
}

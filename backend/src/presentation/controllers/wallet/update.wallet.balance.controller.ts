// import { Request, Response } from "express";
// import { IUpdateWalletBalanceUsecase } from "../../../application/interfaces/wallet";
// import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

// export class UpdateWalletBalanceController {
// 	constructor(private updateWalletBalanceUseCase: IUpdateWalletBalanceUsecase) {}

// 	async handle(req: Request, res: Response) {
// 		const { userId, amount } = req.body;
// 		try {
// 			const wallet = await this.updateWalletBalanceUseCase.execute(userId, amount);
// 			res.status(HttpStatusCode.OK).json({ success: true, wallet });
// 		} catch (error) {
// 			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to update wallet balance" });
// 		}
// 	}
// }

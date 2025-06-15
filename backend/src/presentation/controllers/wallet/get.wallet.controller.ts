import { Request, Response } from "express";
import { IGetWalletUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetWalletController {
	constructor(private getWalletUseCase: IGetWalletUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const { userId } = req.params;

			const wallet = await this.getWalletUseCase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, wallet });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

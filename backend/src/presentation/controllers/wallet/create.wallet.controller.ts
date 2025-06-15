import { Request, Response } from "express";
import { ICreateWalletUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class CreateWalletController {
	constructor(private createWalletUseCase: ICreateWalletUsecase) {}

	async handle(req: Request, res: Response) {
		const { userId, role } = req.body;
		try {
			const wallet = await this.createWalletUseCase.execute(userId, role);
			res.status(HttpStatusCode.CREATED).json({success: true , wallet});
		} catch (error) {
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to create wallet" });
		}
	}
}

import { Request, Response } from "express";
import { ICreateWithdrawalRequestUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class CreateWithdrawalRequestController {
	constructor(private createWithdrawalRequestUseCase: ICreateWithdrawalRequestUsecase) {}

	async handle(req: Request, res: Response) {
		try {
			const request = await this.createWithdrawalRequestUseCase.execute(req.body);
			res.status(HttpStatusCode.CREATED).json({ success: true, request });
		} catch (error) {
			res.status(500).json({ error: "Failed to create withdrawal request" });
		}
	}
}

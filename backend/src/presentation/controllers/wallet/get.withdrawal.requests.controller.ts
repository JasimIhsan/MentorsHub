import { Request, Response } from "express";
import { IGetWithdrawalRequestsUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetWithdrawalRequestsController {
	constructor(private getWithdrawalRequestsUseCase: IGetWithdrawalRequestsUsecase) {}

	async handle(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		try {
			const result = await this.getWithdrawalRequestsUseCase.execute(req.params.mentorId, page, limit, {});
			res.status(HttpStatusCode.OK).json({ success: true, withdrawalRequests: result.data, total: result.total });
		} catch (error) {
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
		}
	}
}

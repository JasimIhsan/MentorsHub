import { Request, Response } from "express";
import { IGetTransactionsUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetTransactionsController {
	constructor(private getTransactionsUseCase: IGetTransactionsUsecase) {}

	async handle(req: Request, res: Response) {
		const { userId } = req.params;
		const { role } = req.query;
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		try {
			const result = await this.getTransactionsUseCase.execute(userId, role as string, page, limit, {});
			res.status(HttpStatusCode.OK).json({ success: true, transactions: result.data, total: result.total });
		} catch (error) {
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
		}
	}
}

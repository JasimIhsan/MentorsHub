// GetTransactionsController.ts

import { NextFunction, Request, Response } from "express";
import { IGetTransactionsUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class GetTransactionsController {
	constructor(private getTransactionsUseCase: IGetTransactionsUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		const { userId } = req.params;
		const { role, type, from, to } = req.query;
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		const filter: Record<string, any> = {};

		// Add filters if provided
		if (type) filter.type = type;
		if (from || to) {
			filter.createdAt = {};
			if (from) filter.createdAt.$gte = new Date(from as string);
			if (to) filter.createdAt.$lte = new Date(to as string);
		}

		try {
			const result = await this.getTransactionsUseCase.execute(userId, role as string, page, limit, filter);
			res.status(HttpStatusCode.OK).json({ success: true, transactions: result.data, total: result.total });
		} catch (error) {
			logger.error(`❌ Error in GetTransactionsController: ${error}`);
			next(error);
		}
	}
}

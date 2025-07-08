import { NextFunction, Request, Response } from "express";
import { IGetSessionRequestsUseCase } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";
import { PricingType } from "../../../domain/entities/session.entity";
import { SessionStatusEnum } from "../../../application/interfaces/enums/session.status.enums";

export class GetSessionRequestsController {
	constructor(private getSessionByMentorUsecase: IGetSessionRequestsUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const { status, pricing, filterOption, page = "1", limit = "6" } = req.query;

			const queryParams = {
				status: status as SessionStatusEnum | undefined,
				pricing: pricing as PricingType | undefined,
				filterOption: filterOption as "today" | "week" | "all" | "free" | "paid",
				page: parseInt(page as string, 10),
				limit: parseInt(limit as string, 10),
			};

			const result = await this.getSessionByMentorUsecase.execute(mentorId, queryParams);

			res.status(HttpStatusCode.OK).json({
				success: true,
				requests: result.requests,
				total: result.total,
			});
		} catch (error) {
			logger.error(`❌ Error in GetSessionRequestsController: ${error}`);
			next(error);
		}
	}
}

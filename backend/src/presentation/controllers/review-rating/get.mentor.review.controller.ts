import { NextFunction, Request, Response } from "express";
import { IGetMentorReviewsUseCase } from "../../../application/interfaces/usecases/review";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetMentorReviewsController {
	constructor(private getMentorReviewsUseCase: IGetMentorReviewsUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const mentorId = req.params.mentorId;
			const { page, limit, rating } = req.query;

			if (!mentorId) {
				res.status(400).json({ success: false, message: "Mentor ID is required" });
				return;
			}

			const reviews = await this.getMentorReviewsUseCase.execute(mentorId, {
				page: parseInt(page as string) || 1,
				limit: parseInt(limit as string) || 10,
				rating: rating ? parseInt(rating as string) : undefined,
			});

			res.status(HttpStatusCode.OK).json({ success: true, ...reviews });
		} catch (error) {
			logger.error(`❌ Error in GetMentorReviewsController: ${error}`);
			next(error);
		}
	}
}

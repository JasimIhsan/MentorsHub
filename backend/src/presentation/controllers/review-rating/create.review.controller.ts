import { NextFunction, Request, Response } from "express";
import { ICreateReviewUseCase } from "../../../application/interfaces/review";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class CreateReviewController {
	constructor(private createReviewUseCase: ICreateReviewUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { reviewerId, mentorId, sessionId, rating, comment } = req.body;

			const review = await this.createReviewUseCase.execute({
				reviewerId,
				mentorId,
				sessionId,
				rating,
				comment,
			});

			res.status(HttpStatusCode.CREATED).json({ success: true, review: review.toObject() });
		} catch (error: any) {
			logger.error(`❌ Error in CreateReviewController: ${error.message}`);
			next(error);
		}
	}
}

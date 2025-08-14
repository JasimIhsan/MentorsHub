import { NextFunction, Request, Response } from "express";
import { ICreateReviewUseCase } from "../../../application/interfaces/usecases/review";
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

			res.status(HttpStatusCode.CREATED).json({ success: true, review });
		} catch (error) {
			logger.error(`❌ Error in CreateReviewController: ${error}`);
			next(error);
		}
	}
}

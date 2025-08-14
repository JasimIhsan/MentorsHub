import { NextFunction, Request, Response } from "express";
import { IUpdateReviewUseCase } from "../../../application/interfaces/usecases/review";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class UpdateReviewController {
	constructor(private updateReviewUseCase: IUpdateReviewUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { reviewId } = req.params;
			// const { reviewerId, mentorId, sessionId, rating, comment } = req.body;
			const review = await this.updateReviewUseCase.execute(reviewId, req.body);
			res.status(HttpStatusCode.OK).json({ success: true, review,  message: "Review updated successfully" });
		} catch (error) {
			logger.error(`❌ Error in UpdateReviewController: ${error}`);
			next(error);
		}
	}
}

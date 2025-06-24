import { NextFunction, Request, Response } from "express";
import { IUpdateReviewUseCase } from "../../../application/interfaces/review";
import { logger } from "../../../infrastructure/utils/logger";

export class UpdateReviewController {
	constructor(private updateReviewUseCase: IUpdateReviewUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { reviewId } = req.params;
			// const { reviewerId, mentorId, sessionId, rating, comment } = req.body;
			const review = await this.updateReviewUseCase.execute(reviewId, req.body);
			console.log('review: ', review);
			res.status(200).json({ success: true, review,  message: "Review updated successfully" });
		} catch (error: any) {
			logger.error(`❌ Error in UpdateReviewController: ${error.message}`);
			next(error);
		}
	}
}

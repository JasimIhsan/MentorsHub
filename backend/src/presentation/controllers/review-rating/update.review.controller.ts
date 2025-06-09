import { Request, Response } from "express";
import { IUpdateReviewUseCase } from "../../../application/interfaces/review";

export class UpdateReviewController {
	constructor(private updateReviewUseCase: IUpdateReviewUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { reviewId } = req.params;
			// const { reviewerId, mentorId, sessionId, rating, comment } = req.body;
			const review = await this.updateReviewUseCase.execute(reviewId, req.body);
			console.log('review: ', review);
			res.status(200).json({ success: true, review,  message: "Review updated successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

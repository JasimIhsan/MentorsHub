import { Request, Response } from "express";
import { IDeleteReviewUseCase } from "../../../application/interfaces/review";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class DeleteReviewController {
	constructor(private deleteReviewUseCase: IDeleteReviewUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { reviewId } = req.params;
			const { mentorId, userId } = req.query;
			await this.deleteReviewUseCase.execute(reviewId, mentorId as string, userId as string);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Review deleted successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

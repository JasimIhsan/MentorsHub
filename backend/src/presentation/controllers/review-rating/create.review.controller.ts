import { Request, Response } from "express";
import { ICreateReviewUseCase } from "../../../application/interfaces/review";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class CreateReviewController {
	constructor(private createReviewUseCase: ICreateReviewUseCase) {}

	async handle(req: Request, res: Response) {
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
		} catch (err: any) {
			console.log(`error from create review controller: `, err);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message });
		}
	}
}

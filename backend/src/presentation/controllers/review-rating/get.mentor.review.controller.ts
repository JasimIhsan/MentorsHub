import { Request, Response } from "express";
import { IGetMentorReviewsUseCase } from "../../../application/interfaces/review";

export class GetMentorReviewsController {
	constructor(private getMentorReviewsUseCase: IGetMentorReviewsUseCase) {}

	async handle(req: Request, res: Response) {
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

			res.status(200).json({ success: true, ...reviews });
		} catch (err: any) {
			res.status(500).json({ success: false, message: err.message });
		}
	}
}

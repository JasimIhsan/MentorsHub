import { Request, Response } from "express";
import { IFetchMentorUsecase } from "../../../application/interfaces/mentors/mentors.interface";

export class FetchMentorController {
	constructor(private fetchMentorUsecase: IFetchMentorUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const userId = req.params.mentorId;
			const mentor = await this.fetchMentorUsecase.execute(userId);
			res.status(200).json({ success: true, mentor });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

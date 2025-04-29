import { Request, Response } from "express";
import { IFetchSessionMentorUsecase } from "../../../application/interfaces/mentors/mentors.interface";

export class FetchSessionMentorController {
	constructor(private fetchSessionMentorUsecase: IFetchSessionMentorUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const { mentorId } = req.params;
			const sessions = await this.fetchSessionMentorUsecase.execute(mentorId);
			res.status(200).json({ success: true, sessions });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

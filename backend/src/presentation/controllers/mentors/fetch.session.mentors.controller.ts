import { Request, Response } from "express";
import { IFetchUpcomingSessionMentorUsecase } from "../../../application/interfaces/mentors/mentors.interface";

export class FetchUpcomingSessionMentorController {
	constructor(private fetchUpcomingSessionMentorUsecase: IFetchUpcomingSessionMentorUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const { mentorId } = req.params;
			const sessions = await this.fetchUpcomingSessionMentorUsecase.execute(mentorId);
			res.status(200).json({ success: true, sessions });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

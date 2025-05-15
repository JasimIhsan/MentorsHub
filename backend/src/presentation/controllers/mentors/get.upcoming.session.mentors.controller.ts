import { Request, Response } from "express";
import { IGetUpcomingSessionMentorUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetUpcomingSessionMentorController {
	constructor(private getUpcomingSessionMentorUsecase: IGetUpcomingSessionMentorUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const { mentorId } = req.params;
			const sessions = await this.getUpcomingSessionMentorUsecase.execute(mentorId);
			
			res.status(HttpStatusCode.OK).json({ success: true, sessions });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

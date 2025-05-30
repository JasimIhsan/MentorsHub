import { Request, Response } from "express";
import { IGetSessionHistoryUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetSessionHistoryController {
	constructor(private getSessionHistoryUsecase: IGetSessionHistoryUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const { mentorId } = req.params;
			const { status, page = "1", limit = "6" } = req.query;
			const queryParams = {
				status: status as string,
				page: parseInt(page as string, 10),
				limit: parseInt(limit as string, 10),
			};
			const sessions = await this.getSessionHistoryUsecase.execute(mentorId, queryParams);
			res.status(HttpStatusCode.OK).json({ success: true, sessions: sessions.sessions, total: sessions.total });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

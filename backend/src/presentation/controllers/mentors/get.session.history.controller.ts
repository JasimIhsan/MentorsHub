import { NextFunction, Request, Response } from "express";
import { IGetSessionHistoryUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";
import { SessionStatus } from "../../../domain/entities/session.entity";

export class GetSessionHistoryController {
	constructor(private getSessionHistoryUsecase: IGetSessionHistoryUsecase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const { status, page = "1", limit = "6" } = req.query;
			const queryParams = {
				status: status as SessionStatus,
				page: parseInt(page as string, 10),
				limit: parseInt(limit as string, 10),
			};
			const sessions = await this.getSessionHistoryUsecase.execute(mentorId, queryParams);
			res.status(HttpStatusCode.OK).json({ success: true, sessions: sessions.sessions, total: sessions.total });
		} catch (error) {
			logger.error(`❌ Error in GetSessionHistoryController: ${error}`);
			next(error);
		}
	}
}

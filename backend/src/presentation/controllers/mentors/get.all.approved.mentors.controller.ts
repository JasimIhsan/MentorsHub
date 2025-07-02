import { NextFunction, Request, Response } from "express";
import { IGetAllApprovedMentorsUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class GetAllApprovedMentorsController {
	constructor(private getAllApprovedMentorsUsecase: IGetAllApprovedMentorsUsecase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const mentors = await this.getAllApprovedMentorsUsecase.execute();
			res.status(HttpStatusCode.OK).json({ success: true, mentors });
		} catch (error) {
			logger.error(`❌ Error in GetAllApprovedMentorsController: ${error}`);
			next(error);
		}
	}
}

// src/interfaces/http/controllers/mentors/get.all.mentors.controller.ts
import { IGetAllMentorsUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class GetAllMentorsController {
	constructor(private getAllMentorsUsecase: IGetAllMentorsUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit, search, status } = req.query;
			const mentors = await this.getAllMentorsUsecase.execute({
				page: page ? parseInt(page as string) : undefined,
				limit: limit ? parseInt(limit as string) : undefined,
				search: search as string,
				status: status as string,
			});
			res.status(HttpStatusCode.OK).json({ success: true, ...mentors });
		} catch (error) {
			logger.error(`❌ Error in GetAllMentorsController: ${error}`);
			next(error);
		}
	}
}

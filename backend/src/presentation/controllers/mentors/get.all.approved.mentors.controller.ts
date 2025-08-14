import { NextFunction, Request, Response } from "express";
import { IGetAllApprovedMentorsUsecase } from "../../../application/interfaces/usecases/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class GetAllApprovedMentorsController {
	constructor(private getAllApprovedMentorsUsecase: IGetAllApprovedMentorsUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const browserId = req.params.userId;
			const { page, limit, search, sortBy, priceMin, priceMax, skills } = req.query;

			// Parse filters
			const parsedPage = page ? parseInt(page as string, 10) : 1;
			const parsedLimit = limit ? parseInt(limit as string, 10) : 12;
			const parsedPriceMin = priceMin ? parseInt(priceMin as string, 10) : undefined;
			const parsedPriceMax = priceMax ? parseInt(priceMax as string, 10) : undefined;

			// Parse skills from query string:
			// - ?skills=React,Node or ?skills[]=React&skills[]=Node
			let parsedSkills: string[] | undefined;
			if (Array.isArray(skills)) {
				parsedSkills = skills as string[];
			} else if (typeof skills === "string") {
				parsedSkills = skills.split(",").map((i) => i.trim());
			}

			const user = req.user;
			if (!user) throw new Error("User not found");

			const result = await this.getAllApprovedMentorsUsecase.execute(
				{
					page: parsedPage,
					limit: parsedLimit,
					search: search as string,
					sortBy: sortBy as string,
					priceMin: parsedPriceMin,
					priceMax: parsedPriceMax,
					skills: parsedSkills,
				},
				browserId,
			);

			res.status(HttpStatusCode.OK).json({
				success: true,
				mentors: result.mentors,
				total: result.total,
				page: parsedPage,
				limit: parsedLimit,
			});
		} catch (error) {
			logger.error(`❌ Error in GetAllApprovedMentorsController: ${error}`);
			next(error);
		}
	}
}

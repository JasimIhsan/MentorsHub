import { NextFunction, Request, Response } from "express";
import { IGetAllApprovedMentorsUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { logger } from "../../../infrastructure/utils/logger";

export class GetAllApprovedMentorsController {
	constructor(private getAllApprovedMentorsUsecase: IGetAllApprovedMentorsUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const browserId = req.params.userId;
			const { page, limit, search, sortBy, priceMin, priceMax, interests } = req.query;

			// Parse filters
			const parsedPage = page ? parseInt(page as string, 10) : 1;
			const parsedLimit = limit ? parseInt(limit as string, 10) : 12;
			const parsedPriceMin = priceMin ? parseInt(priceMin as string, 10) : undefined;
			const parsedPriceMax = priceMax ? parseInt(priceMax as string, 10) : undefined;

			// Parse interests from query string:
			// - ?interests=React,Node or ?interests[]=React&interests[]=Node
			let parsedInterests: string[] | undefined;
			if (Array.isArray(interests)) {
				parsedInterests = interests as string[];
			} else if (typeof interests === "string") {
				parsedInterests = interests.split(",").map((i) => i.trim());
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
					interests: parsedInterests,
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

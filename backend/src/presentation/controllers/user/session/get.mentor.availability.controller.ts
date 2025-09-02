import { NextFunction, Request, Response } from "express";
import { IGetAvailabilityUseCase } from "../../../../application/interfaces/usecases/mentors/mentors.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetMentorAvailabilityController {
	constructor(private getAvailabilityUsecase: IGetAvailabilityUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const { date, hours } = req.query;

			if (!date || !hours) {
				res.status(HttpStatusCode.BAD_REQUEST).json({
					success: false,
					message: "Both date and hours are required",
				});
				return;
			}

			// Safely parse date
			const parsedDate = new Date(date as string);
			const parsedHours = parseInt(hours as string, 10);

			if (isNaN(parsedDate.getTime())) {
				res.status(HttpStatusCode.BAD_REQUEST).json({
					success: false,
					message: "Invalid date format",
				});
				return;
			}

			if (isNaN(parsedHours) || parsedHours <= 0) {
				res.status(HttpStatusCode.BAD_REQUEST).json({
					success: false,
					message: "Invalid duration in hours",
				});
				return;
			}

			const availability = await this.getAvailabilityUsecase.execute(mentorId, new Date(date as string), parseInt(hours as string));

			const isExist = availability.length > 0 ? true : false;

			res.status(HttpStatusCode.OK).json({ success: true, isExist, availability });
		} catch (error) {
			console.error(`❌❌❌ Error in GetMentorAvailabilityController: ${error}`);
			logger.error(`❌ Error in GetMentorAvailabilityController: ${error}`);
			next(error);
		}
	}
}

import { NextFunction, Request, Response } from "express";
import { IGetAvailabilityUseCase } from "../../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetMentorAvailabilityController {
	constructor(private getAvailabilityUsecase: IGetAvailabilityUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const { dateString } = req.query;
			const date = new Date(dateString as string);
			if (!date) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Date is required" });
				return;
			}

			const availability = await this.getAvailabilityUsecase.execute(mentorId, date);

			const isExist = availability.length > 0 ? true : false;

			res.status(HttpStatusCode.OK).json({ success: true, isExist, availability });
		} catch (error) {
			console.error(`❌❌❌ Error in GetMentorAvailabilityController: ${error}`);
			logger.error(`❌ Error in GetMentorAvailabilityController: ${error}`);
			next(error);
		}
	}
}

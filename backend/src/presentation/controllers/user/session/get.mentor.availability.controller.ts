import { Request, Response } from "express";
import { IGetAvailabilityUseCase } from "../../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetMentorAvailabilityController {
	constructor(private getAvailabilityUsecase: IGetAvailabilityUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { mentorId } = req.params;
			const { date } = req.body;

			if (!date) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Date is required" });
				return;
			}

			const availability = await this.getAvailabilityUsecase.execute(mentorId, date);

			res.status(HttpStatusCode.OK).json({ success: true, availability });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

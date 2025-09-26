import { Request, Response, NextFunction } from "express";
import { IGetMentorAvailabilityToUserUseCase } from "../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetMentorAvailabilityToUserController {
	constructor(private readonly getMentorAvailabilityToUserUseCase: IGetMentorAvailabilityToUserUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const availability = await this.getMentorAvailabilityToUserUseCase.execute(mentorId);
			res.status(HttpStatusCode.OK).json({ success: true, availability });
		} catch (error) {
			next(error);
		}
	}
}

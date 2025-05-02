import { Request, Response } from "express";
import { IGetMentorUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetMentorController {
	constructor(private getMentorUsecase: IGetMentorUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const userId = req.params.mentorId;
			const mentor = await this.getMentorUsecase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, mentor });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

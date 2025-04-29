import { Request, Response } from "express";
import { IVerifyMentorApplicationUsecase } from "../../../../application/interfaces/admin/admin.mentor.application.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class VerifyMentorApplicationController {
	constructor(private verifyMentorApplicationUsecase: IVerifyMentorApplicationUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const { userId } = req.params;
			const { mentorRequestStatus, rejectionReason } = req.body;

			const user = await this.verifyMentorApplicationUsecase.execute(userId, mentorRequestStatus, rejectionReason);
			res.status(HttpStatusCode.OK).json({ success: true, user });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

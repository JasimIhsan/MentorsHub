import { NextFunction, Request, Response } from "express";
import { IVerifyMentorApplicationUsecase } from "../../../../application/interfaces/admin/admin.mentor.application.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class VerifyMentorApplicationController {
	constructor(private verifyMentorApplicationUsecase: IVerifyMentorApplicationUsecase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;
			const { mentorRequestStatus, rejectionReason } = req.body;

			const user = await this.verifyMentorApplicationUsecase.execute(userId, mentorRequestStatus, rejectionReason);
			res.status(HttpStatusCode.OK).json({ success: true, user });
		} catch (error: any) {
			logger.error(`❌ Error in VerifyMentorApplicationController: ${error.message}`);
			next(error);
		}
	}
}

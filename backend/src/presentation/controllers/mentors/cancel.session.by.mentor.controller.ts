import { Request, Response, NextFunction } from "express";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { ICancelSessionByMentorUseCase } from "../../../application/interfaces/usecases/session";

export class CancelSessionByMentorController {
	constructor(private readonly _useCase: ICancelSessionByMentorUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId, userId } = req.params;

			console.log("userId: ", userId);
			console.log("sessionId: ", sessionId);

			const session = await this._useCase.execute(sessionId, userId);
			res.status(HttpStatusCode.OK).json({ success: true, session, message: "Session cancelled successfully" });
		} catch (error) {
			logger.error(`❌ Error in CancelSessionByMentorController: ${error}`);
			next(error);
		}
	}
}

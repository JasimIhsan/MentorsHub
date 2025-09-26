import { Request, Response, NextFunction } from "express";
import { IGetSessionByUserUseCase } from "../../../../application/interfaces/usecases/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetSessionByUserController {
	constructor(private readonly getSessionByUserUseCase: IGetSessionByUserUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId, sessionId } = req.params;
			const session = await this.getSessionByUserUseCase.execute(sessionId, userId);
			res.status(HttpStatusCode.OK).json({ success: true, session });
		} catch (error) {
			next(error);
		}
	}
}

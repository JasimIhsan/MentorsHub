import { NextFunction, Request, Response } from "express";
import { IGetSessionByUserUseCase } from "../../../../application/interfaces/usecases/session";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetSessionByUserController {
   constructor(private readonly getSessionByUserUseCase: IGetSessionByUserUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
         const session = await this.getSessionByUserUseCase.execute(sessionId, userId);
         res.status(HttpStatusCode.OK).json({ success: true, session });
      } catch (error) {
         next(error);
      }
   }
}

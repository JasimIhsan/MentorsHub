import { NextFunction, Request, Response } from "express";
import { IGetUserChatsUseCase } from "../../../application/interfaces/usecases/messages";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetUserChatsController {
   constructor(private getUserChatsUseCase: IGetUserChatsUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const chats = await this.getUserChatsUseCase.execute(userId);
         res.status(HttpStatusCode.OK).json({ success: true, chats });
      } catch (error) {
         logger.error(`❌ Error in GetUserChatsController: ${error}`);
         next(error);
      }
   }
}

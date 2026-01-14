import { NextFunction, Request, Response } from "express";
import { IGetMessagesByChatUseCase } from "../../../application/interfaces/usecases/messages";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetMessagesByChatController {
   constructor(private getMessageByChatUseCase: IGetMessagesByChatUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const chatId = Array.isArray(req.params.chatId) ? req.params.chatId[0] : req.params.chatId;
         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 10;
         const messages = await this.getMessageByChatUseCase.execute(chatId, page, limit);
         res.status(HttpStatusCode.OK).json({ success: true, messages });
      } catch (error) {
         logger.error(`❌ Error in GetMessagesByChatController: ${error}`);
         next(error);
      }
   }
}

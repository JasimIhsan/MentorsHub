import { NextFunction, Request, Response } from "express";
import { IGetUserNotificationsUseCase } from "../../../application/interfaces/usecases/notification/notification.usecase";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetUserNotificationsController {
   constructor(private getUserNotificationsUseCase: IGetUserNotificationsUseCase) {}

   async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 5;
         const isRead = req.query.isRead !== undefined ? req.query.isRead === "true" : undefined;
         const search = (req.query.search as string) || "";

         const result = await this.getUserNotificationsUseCase.execute({
            userId,
            page,
            limit,
            isRead,
            search,
         });

         res.status(HttpStatusCode.OK).json({
            success: true,
            data: result,
         });
      } catch (error) {
         logger.error(`❌ Error in GetUserNotificationsController: ${error}`);
         next(error);
      }
   }
}

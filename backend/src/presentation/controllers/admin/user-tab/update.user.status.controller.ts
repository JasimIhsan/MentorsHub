import { NextFunction, Request, Response } from "express";
import { IUpdateUserStatusUsecase } from "../../../../application/interfaces/usecases/admin/admin.usertab.interfaces";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class UpdateUserStatusController {
   constructor(private updateUserStatusUsecase: IUpdateUserStatusUsecase) {}

   async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const updatedUser = await this.updateUserStatusUsecase.execute(userId);
         res.status(HttpStatusCode.OK).json({ success: true, user: updatedUser });
      } catch (error) {
         logger.error(`❌ Error in UpdateUserStatusController: ${error}`);
         next(error);
      }
   }
}

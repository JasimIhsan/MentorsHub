import { NextFunction, Request, Response } from "express";
import { IDeleteUserUsecase } from "../../../../application/interfaces/usecases/admin/admin.usertab.interfaces";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class DeleteUserController {
   constructor(private deleteUserUsecase: IDeleteUserUsecase) {}

   async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
         await this.deleteUserUsecase.execute(userId);
         res.status(HttpStatusCode.OK).json({ success: true, message: "User deleted successfully" });
      } catch (error) {
         logger.error(`❌ Error in DeleteUserController: ${error}`);
         next(error);
      }
   }
}

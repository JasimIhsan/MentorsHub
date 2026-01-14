import { NextFunction, Request, Response } from "express";
import { IUserDTO } from "../../../../application/dtos/user.dtos";
import { IUpdateUserProfileUseCase } from "../../../../application/interfaces/usecases/user/user.profile.usecase.interfaces";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class UpdateUserController {
   constructor(private updateUserUsecase: IUpdateUserProfileUseCase) {}

   async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const userData: Partial<IUserDTO> = req.body;

         const updatedUser = await this.updateUserUsecase.execute(userId, userData);
         res.status(HttpStatusCode.OK).json({ success: true, user: updatedUser });
      } catch (error) {
         logger.error(`❌ Error in UpdateUserController: ${error}`);
         next(error);
      }
   }
}

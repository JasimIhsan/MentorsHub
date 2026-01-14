import { NextFunction, Request, Response } from "express";
import { IGetWalletUsecase } from "../../../application/interfaces/usecases/wallet";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetWalletController {
   constructor(private getWalletUseCase: IGetWalletUsecase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

         const wallet = await this.getWalletUseCase.execute(userId);
         res.status(HttpStatusCode.OK).json({ success: true, wallet });
      } catch (error) {
         logger.error(`❌ Error in GetWalletController: ${error}`);
         next(error);
      }
   }
}

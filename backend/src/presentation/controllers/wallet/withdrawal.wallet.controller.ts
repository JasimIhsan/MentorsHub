import { NextFunction, Request, Response } from "express";
import { IWithdrawWalletUsecase } from "../../../application/interfaces/usecases/wallet";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class WithdrawWalletController {
   constructor(private withdrawWalletUseCase: IWithdrawWalletUsecase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const { amount } = req.body;
         const result = await this.withdrawWalletUseCase.execute(userId, amount);
         res.status(HttpStatusCode.OK).json({ success: true, wallet: result.wallet, transaction: result.transaction });
      } catch (error) {
         logger.error(`❌ Error in WithdrawWalletController: ${error}`);
         next(error);
      }
   }
}

// interfaces/controllers/wallet/topup.wallet.controller.ts

import { NextFunction, Request, Response } from "express";
import { IWalletTopUpUsecase } from "../../../application/interfaces/usecases/wallet";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class WalletTopUpController {
   constructor(private topUpUseCase: IWalletTopUpUsecase) {}

   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userIdParam = req.params.userId;
         const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
         const { amount, purpose, description } = req.body;

         if (!amount || !purpose || !description || !userId) throw new Error("Missing required fields.");

         const result = await this.topUpUseCase.execute({ userId: userId as string, amount, purpose, description });

         res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Wallet topped up successfully.",
            data: result,
         });
      } catch (error) {
         logger.error(`❌ Error in WalletTopUpController: ${error}`);
         next(error);
      }
   }
}

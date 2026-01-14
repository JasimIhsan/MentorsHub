import { NextFunction, Request, Response } from "express";
import { IRequestWithdrawalUseCase } from "../../../application/interfaces/usecases/withdrawal.request";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class RequestWithdrawalController {
   constructor(private readonly requestWithdrawalUseCase: IRequestWithdrawalUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
         const { amount } = req.body;
         const request = await this.requestWithdrawalUseCase.execute(userId, amount);
         res.status(HttpStatusCode.OK).json({ success: true, request });
      } catch (error) {
         logger.error(`❌ Error in RequestWithdrawalController: ${error}`);
         next(error);
      }
   }
}

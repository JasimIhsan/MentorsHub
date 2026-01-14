import { NextFunction, Request, Response } from "express";
import { IApproveWithdrawalRequestUseCase } from "../../../../application/interfaces/usecases/withdrawal.request";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class ApproveWithdrawalRequestController {
   constructor(private readonly approveWithdrawalRequestUseCase: IApproveWithdrawalRequestUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const requestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
         const { paymentId } = req.body;
         const request = await this.approveWithdrawalRequestUseCase.execute(requestId, paymentId);
         res.status(HttpStatusCode.OK).json({ success: true, request });
      } catch (error) {
         logger.error(`❌ Error in ApproveWithdrawalRequestController: ${error}`);
         next(error);
      }
   }
}

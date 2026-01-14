import { NextFunction, Request, Response } from "express";
import { IRejectWithdrawalRequestUseCase } from "../../../../application/interfaces/usecases/withdrawal.request";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class RejectWithdrawalRequestController {
   constructor(private readonly rejectWithdrawalRequestUseCase: IRejectWithdrawalRequestUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const requestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
         const reqeust = await this.rejectWithdrawalRequestUseCase.execute(requestId);
         res.status(HttpStatusCode.OK).json({ success: true, reqeust, message: "Request rejected successfully" });
      } catch (error) {
         logger.error("❌ Error in RejectWithdrawalRequestController: ", error);
         next(error);
      }
   }
}

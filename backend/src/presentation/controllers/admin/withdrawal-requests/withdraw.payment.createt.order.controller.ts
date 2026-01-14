import { NextFunction, Request, Response } from "express";
import { IWithdrawPaymentCreateOrderUseCase } from "../../../../application/interfaces/usecases/withdrawal.request";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class WithdrawPaymentCreateOrderController {
   constructor(private readonly withdrawPaymentCreateOrderUseCase: IWithdrawPaymentCreateOrderUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const requestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
         const order = await this.withdrawPaymentCreateOrderUseCase.execute(requestId);
         res.status(HttpStatusCode.OK).json({ success: true, order });
      } catch (error) {
         next(error);
      }
   }
}

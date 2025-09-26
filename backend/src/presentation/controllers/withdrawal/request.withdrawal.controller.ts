import { Request, Response, NextFunction } from 'express';
import { IRequestWithdrawalUseCase } from '../../../application/interfaces/usecases/withdrawal.request';
import { HttpStatusCode } from '../../../shared/constants/http.status.codes';
import { logger } from '../../../infrastructure/utils/logger';

export class RequestWithdrawalController {
   constructor(private readonly requestWithdrawalUseCase: IRequestWithdrawalUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const { userId } = req.params;
         const { amount } = req.body;
         const request = await this.requestWithdrawalUseCase.execute(userId, amount);
         res.status(HttpStatusCode.OK).json({ success: true, request });
      } catch (error) {
         logger.error(`❌ Error in RequestWithdrawalController: ${error}`);
         next(error);
      }
   }
}

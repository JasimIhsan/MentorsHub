import { NextFunction, Request, Response } from "express";
import { IUpdateSessionStatusUseCase } from "../../../application/interfaces/usecases/session";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class UpdateSessionStatusController {
   constructor(private updateSessionStatusUsecase: IUpdateSessionStatusUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const requestId = Array.isArray(req.params.requestId) ? req.params.requestId[0] : req.params.requestId;
         const { status, reason } = req.body;
         await this.updateSessionStatusUsecase.execute(requestId, status, reason);
         res.status(HttpStatusCode.OK).json({ success: true, message: "Request updated successfully" });
      } catch (error) {
         logger.error(`❌ Error in UpdateSessionStatusController: ${error}`);
         next(error);
      }
   }
}

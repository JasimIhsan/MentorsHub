import { NextFunction, Request, Response } from "express";
import { IUpdateReportStatusUseCase } from "../../../application/interfaces/usecases/reports";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class UpdateReportStatusController {
   constructor(private readonly updateReportStatusUseCase: IUpdateReportStatusUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const reportId = Array.isArray(req.params.reportId) ? req.params.reportId[0] : req.params.reportId;
         const { status, adminNote } = req.body;
         const report = await this.updateReportStatusUseCase.execute(reportId, status, adminNote);
         res.status(HttpStatusCode.OK).json({ success: true, report });
      } catch (error) {
         logger.error(`❌ Error in UpdateReportStatusController: ${error}`);
         next(error);
      }
   }
}

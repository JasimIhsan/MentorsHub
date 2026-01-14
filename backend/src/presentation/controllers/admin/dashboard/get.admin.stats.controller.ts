import { NextFunction, Request, Response } from "express";
import { IGetAdminStatsUseCase } from "../../../../application/interfaces/usecases/admin/admin.dashboard.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetAdminStatsController {
   constructor(private readonly getAdminStatsUseCase: IGetAdminStatsUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const adminId = Array.isArray(req.params.adminId) ? req.params.adminId[0] : req.params.adminId;
         const stats = await this.getAdminStatsUseCase.execute(adminId);
         res.status(HttpStatusCode.OK).json({ success: true, stats });
      } catch (error) {
         next(error);
      }
   }
}

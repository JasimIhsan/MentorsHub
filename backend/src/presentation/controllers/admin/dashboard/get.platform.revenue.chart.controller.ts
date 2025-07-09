import { Request, Response, NextFunction } from "express";
import { IGetPlatformRevenueChartDataUseCase } from "../../../../application/interfaces/admin/admin.dashboard.interface";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetPlatformRevenueChartDataController {
	constructor(private readonly _useCase: IGetPlatformRevenueChartDataUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const adminId = req.params.adminId;
			const chartData = await this._useCase.execute(adminId);

			res.status(200).json({ success: true, chartData });
		} catch (error) {
			logger.error(`❌ Error in GetPlatformRevenueChartDataController: ${error}`);
			next(error);
		}
	}
}

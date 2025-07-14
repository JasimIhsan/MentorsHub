import { Request, Response, NextFunction } from "express";
import { IGetPlatformRevenueChartDataUseCase } from "../../../../application/interfaces/admin/admin.dashboard.interface";
import { logger } from "../../../../infrastructure/utils/logger";

export class GetPlatformRevenueChartDataController {
	constructor(private readonly _useCase: IGetPlatformRevenueChartDataUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const adminId = req.params.adminId;
			const range = req.query.range;

			let months = 0;
			switch (range) {
				case "30days":
					months = 1;
					break;
				case "6months":
					months = 6;
					break;
				case "1year":
					months = 12;
					break;
				case "all":
					months = 0;
					break;
			}

			const chartData = await this._useCase.execute(adminId, months);

			res.status(200).json({ success: true, chartData });
		} catch (error) {
			logger.error(`❌ Error in GetPlatformRevenueChartDataController: ${error}`);
			next(error);
		}
	}
}

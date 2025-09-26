import { Request, Response, NextFunction } from "express";
import { IGetPlatformRevenueChartDataUseCase } from "../../../../application/interfaces/usecases/admin/admin.dashboard.interface";
import { logger } from "../../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetPlatformRevenueChartDataController {
	constructor(private readonly getPlatformRevenueChartDataUseCase: IGetPlatformRevenueChartDataUseCase) {}
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

			const chartData = await this.getPlatformRevenueChartDataUseCase.execute(adminId, months);

			res.status(HttpStatusCode.OK).json({ success: true, chartData });
		} catch (error) {
			logger.error(`❌ Error in GetPlatformRevenueChartDataController: ${error}`);
			next(error);
		}
	}
}
